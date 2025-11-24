# Quick Fix: Docker Not Found in Jenkins

## Problem
Jenkins can't find Docker commands. You're seeing:
```
docker: not found
docker-compose: not found
```

## Solution

Run these commands on your AWS EC2 instance:

### Step 1: Add Jenkins user to Docker group
```bash
sudo usermod -aG docker jenkins
```

### Step 2: Install Docker Compose (if not installed)
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 3: Create symbolic link for docker-compose (alternative method)
```bash
# If docker compose is installed as a plugin
sudo ln -s /usr/libexec/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose
```

### Step 4: Verify Docker is installed
```bash
# Check if Docker is installed
docker --version

# If not installed, install Docker:
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 5: Restart Jenkins
```bash
sudo systemctl restart jenkins
```

### Step 6: Verify Jenkins can access Docker
```bash
# Switch to jenkins user and test
sudo -u jenkins docker ps
sudo -u jenkins docker-compose --version
```

Expected output:
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

If this works, Jenkins can now access Docker!

### Step 7: Rebuild in Jenkins
1. Go to Jenkins dashboard
2. Click on your job "A2"
3. Click **Build Now**

---

## Quick One-Liner Fix

If you want to do it all at once:

```bash
# Run all commands together
sudo usermod -aG docker jenkins && \
sudo systemctl restart jenkins && \
echo "✅ Jenkins user added to docker group and restarted"
```

Then wait 30 seconds and try building again in Jenkins.

---

## Verify Everything Works

After restarting Jenkins, run:

```bash
# Test as jenkins user
sudo -u jenkins docker ps
sudo -u jenkins docker --version
```

If both commands work without errors, you're good to go! 🚀

---

## Alternative: Run Commands as Root (NOT RECOMMENDED for production)

If you need a quick temporary fix (not secure for production):

1. Edit Jenkinsfile and add `sudo` before docker commands:
```groovy
sh 'sudo docker build -t blog-app:latest .'
sh 'sudo docker run -d ...'
```

2. Give Jenkins sudo permissions for Docker:
```bash
sudo visudo
```

Add this line:
```
jenkins ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/local/bin/docker-compose
```

**⚠️ Warning**: This is less secure. Use the user group method instead.

---

## Still Not Working?

If commands still fail, check:

1. **Is Docker running?**
   ```bash
   sudo systemctl status docker
   ```

2. **Can root user run Docker?**
   ```bash
   sudo docker ps
   ```

3. **Check Jenkins logs**
   ```bash
   sudo journalctl -u jenkins -f
   ```

4. **Restart both services**
   ```bash
   sudo systemctl restart docker
   sudo systemctl restart jenkins
   ```

---

## Summary

The issue is that the `jenkins` user doesn't have permission to run Docker commands.

**Quick Fix:**
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Wait 30 seconds, then rebuild in Jenkins. It should work! ✅
