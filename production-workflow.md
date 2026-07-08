# TimeLedger Production Deployment Workflow

This document outlines the steps to move TimeLedger from development to a production environment.

## 📦 1. Build Process

### Backend (Spring Boot)
Generate a production-ready JAR file:
```bash
cd backend
./mvnw clean package -Pprod -DskipTests
```
*The `Dockerfile` in the backend root can be used to build a container image:*
```bash
docker build -t timeledger-backend .
```

### Frontend (Angular)
Compile the frontend with production optimizations (AOT, Minification):
```bash
cd timeLedgerUI
npm install
npm run build -- --configuration production
```
*Outputs will be in `timeLedgerUI/dist/time-ledger-ui/`.*

## ⚙️ 2. Environment Configuration

### Mandatory Environment Variables
In production, do **not** store secrets in `application.yaml`. Use environment variables:

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | Postgres Connection String |
| `SPRING_DATASOURCE_USERNAME` | Postgres Username |
| `SPRING_DATASOURCE_PASSWORD` | Postgres Password |
| `SPRING_DATA_MONGODB_URI` | Mongo Connection String |
| `TIMELEDGER_APP_JWTSECRET` | Secure 64-char String |

## 🚀 3. Deployment Strategy

### Option A: Docker Compose (Recommended)
Use the included `docker-compose.yml` (to be created) to orchestrate Postgres, Mongo, and the Backend.

### Option B: Cloud (AWS/Azure/GCP)
1.  **Database**: Use managed services (AWS RDS for Postgres, MongoDB Atlas).
2.  **Frontend**: Host the `dist/` folder on an S3 Bucket or Vercel/Netlify.
3.  **Backend**: Deploy the JAR/Container to an EC2 instance or Kubernetes.

## 🛡️ 4. Security Checklist
- [ ] Change default `password123` for the seeder in production.
- [ ] Enable HTTPS/SSL at the Load Balancer level.
- [ ] Set `jwtExpirationMs` to a shorter duration (e.g., 1 hour).
- [ ] Ensure `h2-console` is disabled in the production profile.

## 📈 5. Monitoring
Access Actuator endpoints for health checks:
- Health: `GET /actuator/health`
- Metrics: `GET /actuator/metrics`
