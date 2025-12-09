 # Docker Deployment Guide for Next.js Blog

## Prerequisites
jenkins chekc
- Docker installed on your AWS machine
- Docker Compose installed (optional but recommended)
- Your `.env` file with all environment variables

---

## Quick Start with Docker Compose

### 1. Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

---

## Manual Docker Commands (Without Docker Compose)

### 1. Build the Docker Image

```bash
docker build -t next-blog:latest .
```

### 2. Run the Container

```bash
docker run -d \
  --name next-blog \
  -p 3000:3000 \
  --env-file .env \
  -e NEXTAUTH_URL=http://next-blog-site.duckdns.org:3000 \
  next-blog:latest
```

### 3. View Logs

```bash
docker logs -f next-blog
```

### 4. Stop the Container

```bash
docker stop next-blog
docker rm next-blog
```

---

## AWS Deployment Steps

### 1. Copy Files to AWS EC2

```bash
# From your local machine, copy files to AWS
scp -r -i your-key.pem ./next-blog ec2-user@your-aws-ip:/home/ec2-user/
```

### 2. SSH into AWS Machine

```bash
ssh -i your-key.pem ec2-user@your-aws-ip
```

### 3. Navigate to Project Directory

```bash
cd ~/next-blog
```

### 4. Create `.env` File on AWS

```bash
nano .env
```

Paste your environment variables:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
NODE_ENV=production
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://next-blog-site.duckdns.org:3000
DATABASE_URL=your_mongodb_connection_string
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### 5. Build and Run with Docker Compose

```bash
docker-compose up -d --build
```

### 6. Verify Deployment

```bash
# Check if container is running
docker ps

# View logs
docker-compose logs -f

# Test the application
curl http://localhost:3000
```

### 7. Access Your Blog

Open browser and visit: `http://next-blog-site.duckdns.org:3000`

---

## Useful Docker Commands

### View Running Containers
```bash
docker ps
```

### View All Containers (including stopped)
```bash
docker ps -a
```

### Restart Container
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

### View Container Logs
```bash
docker-compose logs -f
```

### Execute Command in Container
```bash
docker exec -it next-blog sh
```

### Remove Container and Image
```bash
docker-compose down
docker rmi next-blog:latest
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs

# Check if port 3000 is already in use
netstat -tuln | grep 3000

# Kill process using port 3000
sudo fuser -k 3000/tcp
```

### Database Connection Issues

1. Verify `DATABASE_URL` in `.env`
2. Check MongoDB Atlas network access allows AWS IP
3. Test connection from container:
   ```bash
   docker exec -it next-blog sh
   # Inside container:
   node -e "const { MongoClient } = require('mongodb'); new MongoClient(process.env.DATABASE_URL).connect().then(() => console.log('Connected!')).catch(console.error)"
   ```

### OAuth Not Working

1. Verify Google/GitHub callback URLs include your domain:
   - `http://next-blog-site.duckdns.org:3000/api/auth/callback/google`
   - `http://next-blog-site.duckdns.org:3000/api/auth/callback/github`

2. Check `NEXTAUTH_URL` matches your domain exactly

### Prisma Issues

If you encounter Prisma errors, rebuild with:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Your blog's public URL | `http://next-blog-site.duckdns.org:3000` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with: `openssl rand -base64 32` |
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | From Google Cloud Console |
| `GITHUB_ID` | GitHub OAuth App ID | From GitHub Developer Settings |
| `GITHUB_SECRET` | GitHub OAuth App Secret | From GitHub Developer Settings |

---

## Port Configuration

The application runs on port **3000** inside the container and is exposed on port **3000** on the host machine.

If you need to change the port:

1. Update `docker-compose.yml`:
   ```yaml
   ports:
     - "8080:3000"  # Host:Container
   ```

2. Update `NEXTAUTH_URL`:
   ```
   NEXTAUTH_URL=http://next-blog-site.duckdns.org:8080
   ```

---

## Production Best Practices

### 1. Use Docker Compose
- Easier to manage
- Environment variables in one place
- Simple start/stop/restart

### 2. Enable Auto-Restart
Already configured in `docker-compose.yml`:
```yaml
restart: unless-stopped
```

### 3. Monitor Logs
```bash
# View last 100 lines
docker-compose logs --tail=100

# Follow logs in real-time
docker-compose logs -f
```

### 4. Update Application
```bash
# On local machine: git push changes
# On AWS machine:
git pull
docker-compose up -d --build
```

### 5. Backup Strategy
- MongoDB: Use MongoDB Atlas automated backups
- Code: Keep in Git repository
- Environment: Backup `.env` file securely

---

## Security Notes

- Never commit `.env` file to Git
- Use strong `NEXTAUTH_SECRET` (at least 32 characters)
- Keep MongoDB credentials secure
- Configure AWS Security Groups to only allow necessary ports
- Use HTTPS in production (setup with reverse proxy like Nginx)

---

## Next Steps After Deployment

1. ✅ Verify blog loads at your domain
2. ✅ Test Google OAuth login
3. ✅ Test GitHub OAuth login
4. ✅ Create a test blog post
5. ✅ Test category filtering
6. ✅ Test comments functionality
7. 🔒 (Optional) Setup SSL/HTTPS with Let's Encrypt + Nginx
8. 📊 (Optional) Setup monitoring with PM2 or similar

---

## Quick Reference

```bash
# Build and start
docker-compose up -d --build

# Stop
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

Your Next.js blog is now containerized and ready for AWS deployment! 🚀
