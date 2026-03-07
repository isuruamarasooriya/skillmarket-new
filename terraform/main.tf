provider "aws" {
  region = "ap-south-1"
}

resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "Skill-Market-VPC"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "Skill-Market-Public-Subnet"
  }
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

resource "aws_instance" "app_server" {
  ami           = "ami-0dee22c13ea7a9a67"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public_subnet.id
  key_name      = "skill-market-key"

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install docker.io -y
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "Skill-Market-Server"
  }
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

output "server_ip" {
  value = aws_instance.app_server.public_ip
}

output "ecr_frontend_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_url" {
  value = aws_ecr_repository.backend.repository_url
}