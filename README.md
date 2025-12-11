# Auto-Generated Blog (AWS + Docker)

End-to-end demo: React frontend, Node.js backend, Postgres DB, Dockerized, deployable via AWS CodeBuild + ECR to an EC2 host.

## Local Development

1. Create backend env:
   - Copy `backend/.env.example` to `backend/.env` and set `HF_TOKEN`.
2. Start stack:

```powershell
cd infra
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Postgres: localhost:5432

## AWS Build (CodeBuild)
- Use `infra/buildspec.yml` in a CodeBuild project with IAM permissions to ECR.
- Parameter Store keys:
  - `/app/ecr_account_id` = your AWS account ID
- The build will create and push images:
  - `auto-blog-backend:<commit>`
  - `auto-blog-frontend:<commit>`

## EC2 Deployment
- On EC2, log in to ECR and pull latest tags; run containers with your chosen approach (compose or individual docker run).

## Daily Article Generation
- Backend uses `node-cron` to generate one article per day via HuggingFace Router API.
- Initial data loaded from `infra/init-db.sql` ensures at least 3 articles.

## Folder Overview
- `backend/` Node.js + Express, scheduler, AI client.
- `frontend/` React (Vite), built to static and served via Nginx.
- `infra/` CodeBuild buildspec and docker-compose for local dev.
