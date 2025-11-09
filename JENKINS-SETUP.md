# Jenkins Setup Guide for Next.js Blog

## Prerequisites

1. **Jenkins installed** on your AWS machine
2. **Docker installed** on your AWS machine
3. **Git installed** on your AWS machine
4. Jenkins user has **Docker permissions**

---

## Step 1: Install Jenkins on AWS (Ubuntu)

```bash
# Update system
sudo apt update

# Install Java (required for Jenkins)
sudo apt install -y fontconfig openjdk-17-jre

# Add Jenkins repository
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check status
sudo systemctl status jenkins
```

---

## Step 2: Configure Jenkins

### Access Jenkins

1. Open browser: `http://your-aws-ip:8080`
2. Get initial admin password:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Install suggested plugins
4. Create admin user

---

## Step 3: Give Jenkins User Docker Permissions

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Verify
sudo -u jenkins docker ps
```

---

## Step 4: Install Required Jenkins Plugins

In Jenkins Dashboard:
1. Go to **Manage Jenkins** → **Manage Plugins**
2. Install these plugins:
   - **Docker Pipeline** (if using Docker commands)
   - **Git** (usually pre-installed)
   - **Pipeline** (usually pre-installed)

---

## Step 5: Create Jenkins Pipeline Job

### Option A: Pipeline from Git Repository

1. **New Item** → Enter name: `Next-Blog-Deploy` → **Pipeline** → OK

2. Under **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/laiqasajjadexe/Blog-Website-Next.js.git`
   - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

3. Click **Save**

### Option B: Pipeline Script Directly

1. **New Item** → Enter name: `Next-Blog-Deploy` → **Pipeline** → OK

2. Under **Pipeline** section:
   - **Definition**: Pipeline script
   - Copy the entire content from `Jenkinsfile` and paste it

3. Click **Save**

---

## Step 6: Prepare Environment File

On your AWS machine, create `.env` file in the project directory:

```bash
cd /var/lib/jenkins/workspace/Next-Blog-Deploy
# or wherever your project will be cloned

# Create .env file
sudo nano .env
```

Add your environment variables:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
NODE_ENV=production
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://next-blog-site.duckdns.org:3000
DATABASE_URL=your_mongodb_connection_string
```

Save: `Ctrl+X`, `Y`, `Enter`

**Important**: Make sure Jenkins can read this file:
```bash
sudo chmod 644 .env
sudo chown jenkins:jenkins .env
```

---

## Step 7: Configure AWS Security Groups

Allow these ports in AWS Security Group:
- **8080** - Jenkins web interface
- **3000** - Next.js blog
- **22** - SSH (already open)

---

## Step 8: Run the Pipeline

1. Go to your Jenkins job: `Next-Blog-Deploy`
2. Click **Build Now**
3. Watch the build progress in **Build History**
4. Click on the build number → **Console Output** to see logs

---

## Jenkins Pipeline Stages Explained

```
1. Checkout          - Gets code from Git repository
2. Environment Check - Verifies Docker and Node are available
3. Stop Old Container - Stops previous version if running
4. Build Docker Image - Builds new Docker image
5. Run Container     - Starts new container with your blog
6. Verify Deployment - Checks if container is running
7. Cleanup Old Images - Removes unused Docker images
```

---

## Troubleshooting

### Issue: Permission Denied (Docker)

**Solution:**
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue: .env File Not Found

**Solution:**
```bash
# Create .env in workspace directory
cd /var/lib/jenkins/workspace/Next-Blog-Deploy
sudo nano .env
# Add your environment variables
sudo chown jenkins:jenkins .env
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or stop the container manually
docker stop next-blog
docker rm next-blog
```

### Issue: Build Fails with OOM (Out of Memory)

**Solution:**
```bash
# Add swap space
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Verify
free -h
```

### Issue: Jenkins Can't Access Git Repository

**Solution for Private Repos:**
1. In Jenkins: **Credentials** → **Add Credentials**
2. Type: Username with password or SSH key
3. Add GitHub credentials
4. Use these credentials in pipeline configuration

---

## Automated Deployment (Webhook)

To automatically deploy when you push to GitHub:

### 1. Install GitHub Plugin in Jenkins
- Manage Jenkins → Manage Plugins → GitHub Integration Plugin

### 2. Configure Webhook in GitHub
1. Go to your GitHub repository
2. **Settings** → **Webhooks** → **Add webhook**
3. Payload URL: `http://your-aws-ip:8080/github-webhook/`
4. Content type: `application/json`
5. Select: **Just the push event**
6. **Active** ✓
7. **Add webhook**

### 3. Configure Jenkins Job
1. In your pipeline job configuration
2. Under **Build Triggers**
3. Check: **GitHub hook trigger for GITScm polling**
4. **Save**

Now Jenkins will automatically build and deploy when you push to GitHub! 🚀

---

## Manual Deployment Commands

If you need to deploy manually without Jenkins:

```bash
# Pull latest code
cd ~/Blog-Website-Next.js
git pull

# Stop old container
docker stop next-blog || true
docker rm next-blog || true

# Build new image
docker build -t blog-app:latest .

# Run new container
docker run -d \
  --name next-blog \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  blog-app:latest

# Check logs
docker logs -f next-blog
```

---

## Monitoring

### View Jenkins Logs
```bash
sudo journalctl -u jenkins -f
```

### View Docker Container Logs
```bash
docker logs -f next-blog
```

### Check Container Status
```bash
docker ps
docker stats next-blog
```

---

## Updating the Application

### Via Jenkins
1. Push changes to GitHub
2. Jenkins automatically builds and deploys (if webhook configured)
3. Or manually click **Build Now**

### Manual Update
```bash
cd ~/Blog-Website-Next.js
git pull
# Jenkins will handle the rest, or run manual commands above
```

---

## Quick Reference

### Jenkins URLs
- **Dashboard**: `http://your-aws-ip:8080`
- **Job**: `http://your-aws-ip:8080/job/Next-Blog-Deploy/`

### Important Directories
- **Jenkins Home**: `/var/lib/jenkins/`
- **Workspace**: `/var/lib/jenkins/workspace/Next-Blog-Deploy/`
- **Logs**: `/var/log/jenkins/jenkins.log`

### Useful Commands
```bash
# Restart Jenkins
sudo systemctl restart jenkins

# Check Jenkins status
sudo systemctl status jenkins

# View Jenkins logs
sudo journalctl -u jenkins -f

# Check Docker containers
docker ps

# View container logs
docker logs next-blog

# Rebuild and deploy
# (Just trigger build in Jenkins UI)
```

---

## Security Best Practices

1. **Change default admin password** in Jenkins
2. **Use HTTPS** for Jenkins (setup with Nginx reverse proxy)
3. **Keep .env secure** - never commit to Git
4. **Use Jenkins credentials** for sensitive data
5. **Update Jenkins** regularly
6. **Restrict Jenkins access** with firewall rules

---

## Next Steps

✅ Jenkins installed  
✅ Pipeline configured  
✅ Docker permissions set  
✅ .env file created  
✅ Security groups configured  
✅ First deployment successful  
🔄 Setup webhook for auto-deployment (optional)  
🔒 Configure SSL/HTTPS (recommended)  

Your blog is now deployed with Jenkins CI/CD! 🎉
