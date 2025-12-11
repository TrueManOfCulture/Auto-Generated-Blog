# Auto-Generated Blog (AWS + Docker)

End-to-end demo: React frontend, Node.js backend, Postgres DB, Dockerized, deployable via AWS CodeBuild to an EC2 host.

## Local Development

The local stack uses Docker Compose to run all three services, mimicking the production environment.

1.  **Create backend env:**
    - Copy `backend/.env.example` to `backend/.env` and set your `HF_TOKEN`.

2.  **Start stack:**

    ```powershell
    cd infra
    docker compose up --build
    ```

    - **Frontend (Local Dev):** http://localhost:5173
    - **Backend (API):** http://localhost:8080/api
    - **Postgres:** localhost:5432

---

## AWS Deployment (Free Tier Compliant)

This deployment uses CodeBuild to prepare the source and EC2 to build and run the final containers, avoiding ECR costs.

### 1. CodeBuild Setup (Source Preparation)

The `infra/buildspec.yml` is configured to:
1.  Install frontend dependencies.
2.  Run `npm run build` to compile the static React assets into `frontend/dist`.
3.  Package the entire project source, including the compiled `frontend/dist`, into a single artifact named `deployment_source.zip`.

**CodeBuild Requirements:**
* A CodeBuild project linked to this repo.
* The project must have the **Privileged** flag enabled for Docker environment compatibility (even though we skip building here, it's a good practice for this runtime type).
* The build artifact is stored in an S3 bucket (created by the CodeBuild project).

### 2. EC2 Deployment (Build & Run)

The EC2 instance is the final host where the containers are built and run.

#### A. Prerequisites on EC2
1.  Launch a **t2.micro** EC2 instance (Ubuntu or Amazon Linux).
2.  Ensure its Security Group allows inbound traffic on:
    * **Port 22 (SSH)** from your IP.
    * **Port 80 (HTTP)** from `0.0.0.0/0` (All traffic).
3.  SSH into the instance and install **Docker** and **Docker Compose**.
4.  Manually create the required environment file: `backend/.env` (relative to the project root) and populate it with your `HF_TOKEN` and database connection details (matching the defaults in `infra/docker-compose.yml` if external variables are not used).

#### B. Execution Steps
1.  Download the `deployment_source.zip` artifact from the CodeBuild S3 output bucket and transfer it to your EC2 instance (e.g., using `scp`).
2.  On the EC2 instance, unzip the archive:
    ```bash
    unzip deployment_source.zip
    cd truemanofculture/auto-generated-blog/.../infra 
    ```
    (Adjust the path to reach the `infra` directory containing `docker-compose.yml`).
3.  Build the images locally and start the stack:
    ```bash
    docker compose up -d --build
    ```
The frontend will be available at the EC2 instance's **Public IP address** on Port 80.

---

## Daily Article Generation
- The backend uses `node-cron` to generate one article per day via the HuggingFace Router API.
- Initial data loaded from `infra/init-db.sql` ensures the system contains at least 3 articles upon initial deployment.

## Folder Overview
- `backend/` Node.js + Express, scheduler, AI client.
- `frontend/` React (Vite), built to static and served via Nginx.
- `infra/` CodeBuild buildspec and docker-compose for local dev.
