# Skill-Market: Containerized Full-Stack App & Automated AWS Infrastructure

Skill-Market is a freelance marketplace platform designed for university students to offer professional services while enabling clients to hire them for specific tasks. 

This project demonstrates a production-grade deployment strategy, moving beyond standard application hosting to a fully automated cloud infrastructure using Infrastructure as Code (IaC), CI/CD pipelines, and real-time monitoring.

---

## Infrastructure Architecture

The deployment is architected on Amazon Web Services (AWS) using a highly secure and scalable networking model.

### Networking and Security
- **Custom VPC:** A dedicated Virtual Private Cloud with public subnets, internet gateways, and custom route tables.
- **Reverse Proxy:** Nginx configured as a reverse proxy to manage inbound traffic, secured with automated Let's Encrypt TLS/SSL certificates.
- **Security Groups:** Granular firewall rules to restrict access to application ports and database instances.

### Infrastructure as Code (Terraform)
The entire AWS environment (EC2 instances, VPC, ECR) is managed using Terraform scripts. This ensures consistent, repeatable, and version-controlled infrastructure provisioning without manual intervention in the AWS Console.

---

## DevOps and Automation

### Containerization
The MERN stack (React frontend and Node.js backend) is containerized using Docker and managed via Docker Compose to ensure environment parity between development and production.

### CI/CD Pipeline
A zero-downtime deployment pipeline is implemented via GitHub Actions:
1. Automated builds of private Docker images.
2. Secure image storage in Amazon Elastic Container Registry (ECR).
3. Automated deployment to the production server upon successful code pushes.

### Monitoring and Observability
A robust monitoring stack is deployed to track system performance:
- **Prometheus and cAdvisor:** Collecting real-time container-level hardware metrics.
- **Grafana:** Custom dashboards for visualizing CPU, RAM, and Network I/O metrics.

---

## System Previews

| Cloud Infrastructure (AWS VPC) | Real-time Monitoring (Grafana) |
|---|---|
| ![Architecture Diagram](/architecture.png) | ![Grafana Dashboard](/grafana.png) |

---

## Technical Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud:** AWS (EC2, VPC, ECR, IAM)
- **Infrastructure:** Terraform, Docker, Nginx, Let's Encrypt SSL
- **DevOps:** GitHub Actions, Bash Scripting
- **Observability:** Prometheus, Grafana, cAdvisor

---

## Deployment and Setup

### Local Execution
The application can be run locally for development purposes using Docker:
```bash
git clone [https://github.com/isuruamarasooriya/skillmarket-new.git](https://github.com/isuruamarasooriya/skillmarket-new.git)
cd skillmarket-new
docker-compose up --build
