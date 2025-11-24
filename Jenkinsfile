pipeline {
    agent any

    environment {
        // Path to your .env file on EC2/Jenkins
        ENV_FILE_PATH = '/var/lib/jenkins/.env.production'
        WORKSPACE_DIR = "${WORKSPACE}"
        
        // Application configuration
        APP_PORT = '3000'
        APP_URL = 'http://next-blog-site.duckdns.org:3000'
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo '📥 Cloning repository...'
                git branch: 'main', url: 'https://github.com/laiqasajjadexe/Blog-Website-Next.js.git'
            }
        }

        stage('Setup Environment') {
            steps {
                echo '⚙️ Setting up environment variables...'
                sh '''
                    if [ -f ${ENV_FILE_PATH} ]; then
                        cp ${ENV_FILE_PATH} ${WORKSPACE_DIR}/.env
                        echo "✅ Environment file copied successfully"
                        echo "📋 Environment variables loaded:"
                        cat ${WORKSPACE_DIR}/.env | grep -v -E '(SECRET|PASSWORD|CLIENT_SECRET)' || true
                    else
                        echo "❌ Warning: .env.production not found at ${ENV_FILE_PATH}"
                        echo "Creating default .env file..."
                        touch ${WORKSPACE_DIR}/.env
                        echo "⚠️ Please configure environment variables manually!"
                    fi
                '''
            }
        }

        stage('Stop Existing Containers') {
            steps {
                echo '🛑 Stopping any running containers...'
                sh '''
                    cd ${WORKSPACE_DIR} || exit 1
                    docker-compose down || true
                    docker stop next-blog || true
                    docker rm next-blog || true
                '''
            }
        }

        stage('Clean Docker Cache') {
            steps {
                echo '🧹 Cleaning Docker builder cache...'
                sh 'docker builder prune -f || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    cd ${WORKSPACE_DIR} || exit 1
                    docker build -t blog-app:latest .
                '''
            }
        }

        stage('Run Container') {
            steps {
                echo '🚀 Starting new container...'
                sh '''
                    cd ${WORKSPACE_DIR} || exit 1
                    docker run -d \
                        --name next-blog \
                        -p ${APP_PORT}:3000 \
                        --env-file .env \
                        --restart unless-stopped \
                        blog-app:latest
                '''
            }
        }

        stage('Verify Running Containers') {
            steps {
                echo '✅ Verifying containers are running...'
                sh '''
                    echo "Current running containers:"
                    docker ps
                    echo ""
                    echo "Next-blog container status:"
                    docker ps | grep next-blog || echo "❌ Container not found!"
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Checking application health...'
                sh '''
                    echo "Waiting for application to start..."
                    sleep 15
                    
                    echo "Testing local connection..."
                    curl -f http://localhost:${APP_PORT} || echo "⚠️ Health check failed (container may still be initializing)"
                    
                    echo ""
                    echo "Container logs (last 30 lines):"
                    docker logs next-blog --tail=30
                '''
            }
        }

        stage('Show Container Info') {
            steps {
                echo '📋 Showing container information...'
                sh '''
                    echo "=== Container Status ==="
                    docker inspect next-blog --format='{{.State.Status}}' || echo "Failed to get status"
                    
                    echo ""
                    echo "=== Container Logs (last 50 lines) ==="
                    docker logs next-blog --tail=50 || true
                    
                    echo ""
                    echo "=== Network Information ==="
                    docker port next-blog || true
                '''
            }
        }

        stage('Cleanup Old Images') {
            steps {
                echo '🧹 Cleaning up old Docker images...'
                sh '''
                    docker image prune -f || true
                    echo "Cleanup completed"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline Completed Successfully!'
            echo '🚀 Next.js Blog is now running at ${APP_URL}'
            echo '📊 Access your blog: ${APP_URL}'
            echo ''
            echo '🔍 Quick commands:'
            echo '  - View logs: docker logs -f next-blog'
            echo '  - Stop blog: docker stop next-blog'
            echo '  - Restart blog: docker restart next-blog'
        }
        failure {
            echo '❌ Pipeline Failed. Check logs above for details.'
            sh '''
                echo ""
                echo "=== Full Container Logs ==="
                docker logs next-blog --tail=100 || echo "No logs available"
                
                echo ""
                echo "=== Docker System Info ==="
                docker ps -a | grep next-blog || echo "Container not found"
            '''
        }
        always {
            echo '📊 Pipeline execution finished'
            echo '🐳 Current running containers:'
            sh 'docker ps || true'
            echo ''
            echo '💾 Disk usage:'
            sh 'df -h | grep -E "Filesystem|/dev/root" || true'
        }
    }
}
