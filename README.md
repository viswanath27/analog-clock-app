# Analog Clock App

A beautiful analog clock application deployed on Azure Kubernetes Service.

## 🌐 Live Demo
**https://samayamu.org**

## 🚀 Features
- Real-time analog clock with OREVA design
- Digital time display showing current date and time
- Responsive design with Tailwind CSS
- Deployed on Azure AKS with Kubernetes
- Automatic SSL certificates with Let's Encrypt
- Production-ready with nginx web server

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS
- **Container**: Docker + nginx
- **Orchestration**: Kubernetes (Azure AKS)
- **SSL**: cert-manager + Let's Encrypt
- **CI/CD**: Automated deployment scripts

## 📁 Deployment Files
- `Dockerfile` - Container configuration
- `deployment.yaml` - Kubernetes deployment manifest
- `service.yaml` - Internal load balancing
- `ingress.yaml` - External routing & SSL configuration
- `letsencrypt-issuer.yaml` - SSL certificate automation
- `nginx.conf` - Web server configuration
- `deploy.sh` - Automated deployment script

## 🚀 Quick Deploy

### Prerequisites
- Azure CLI configured
- kubectl configured for AKS cluster
- Docker installed

### Deployment Steps
```bash
# Build and deploy
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment
```bash
# Build and push Docker image
docker build -t your-registry/analog-clock:latest .
docker push your-registry/analog-clock:latest

# Deploy to Kubernetes
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## 🏗 Architecture
```
React App → Docker Container → Azure AKS → nginx Ingress → SSL/HTTPS
```

## 📦 Container Details
- **Base Image**: nginx:alpine
- **Build Size**: ~15MB optimized
- **Port**: 80 (HTTP)
- **Health Check**: /health endpoint

## 🔒 Security Features
- Automatic SSL/TLS certificates
- Security headers configured
- HTTPS-only access (HTTP redirects to HTTPS)
- Container runs as non-root user

## 🌟 Key Features
- **Zero-downtime deployment** with Kubernetes rolling updates
- **Horizontal scaling** ready
- **SSL auto-renewal** via cert-manager
- **Production monitoring** with health checks
- **Cost-optimized** resource allocation

## 📊 Performance
- **Load Time**: < 1 second
- **Bundle Size**: Optimized React build
- **Uptime**: 99.9% (Kubernetes self-healing)

## 🛠 Development

### Local Development
```bash
npm install
npm start
```

### Build Production
```bash
npm run build
```

## 📝 License
MIT License

## 👨‍💻 Author
**Viswanath Barenkala**
- GitHub: [@viswanath27](https://github.com/viswanath27)
- Live Demo: [samayamu.org](https://samayamu.org)
