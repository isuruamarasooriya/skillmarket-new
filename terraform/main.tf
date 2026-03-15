provider "aws" {
  region = "ap-south-1"
}

resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "Skill-Market-VPC" }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  tags = { Name = "Skill-Market-Public-Subnet" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "app_sg" {
  name        = "skill-market-sg"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app_server" {
  ami                    = "ami-0dee22c13ea7a9a67"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public_subnet.id
  key_name               = "skill-market-key"
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install docker.io nginx certbot python3-certbot-nginx awscli -y
              
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu

              cat <<EOT > /etc/nginx/sites-available/skillmarket
              server {
                  listen 80;
                  server_name skillmarket-srilanka.duckdns.org;

                  location / {
                      proxy_pass http://localhost:3000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade \$http_upgrade;
                      proxy_set_header Connection "upgrade";
                      proxy_set_header Host \$host;
                      proxy_cache_bypass \$http_upgrade;
                      proxy_set_header X-Real-IP \$remote_addr;
                      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                      proxy_set_header X-Forwarded-Proto \$scheme;
                  }

                  location /api {
                      proxy_pass http://localhost:5000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade \$http_upgrade;
                      proxy_set_header Connection "upgrade";
                      proxy_set_header Host \$host;
                      proxy_cache_bypass \$http_upgrade;
                      proxy_set_header X-Real-IP \$remote_addr;
                      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                      proxy_set_header X-Forwarded-Proto \$scheme;
                  }
              }
              EOT

              sudo ln -s /etc/nginx/sites-available/skillmarket /etc/nginx/sites-enabled/
              sudo rm -f /etc/nginx/sites-enabled/default
              sudo systemctl restart nginx

              sudo certbot --nginx --non-interactive --agree-tos -m isuruamarasooriya177@gmail.com -d skillmarket-srilanka.duckdns.org
              EOF
              
  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  tags = { Name = "Skill-Market-Server" }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "skill-market-frontend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "backend" {
  name                 = "skill-market-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

output "server_ip" { value = aws_instance.app_server.public_ip }

output "ecr_frontend_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_url" {
  value = aws_ecr_repository.backend.repository_url
}