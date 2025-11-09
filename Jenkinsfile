pipeline {
    agent any
    
    environment {
        // Docker image name
        IMAGE_NAME = 'blog-app'
        IMAGE_TAG = 'latest'
        CONTAINER_NAME = 'next-blog'
        
        // Port mapping
        HOST_PORT = '3000'
        CONTAINER_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Environment Check') {
            steps {
                echo 'Checking environment...'
                sh '''
                    echo "Node version:"
                    node --version || echo "Node not installed"
                    echo "Docker version:"
                    docker --version
                    echo "Current directory:"
                    pwd
                    echo "Files in directory:"
                    ls -la
                '''
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo 'Stopping and removing old container if exists...'
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                '''
            }
        }
        
        stage('Run Container') {
            steps {
                echo 'Starting new container...'
                sh '''
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        --env-file .env \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                sh '''
                    echo "Waiting for container to start..."
                    sleep 10
                    echo "Container status:"
                    docker ps | grep ${CONTAINER_NAME}
                    echo "Container logs:"
                    docker logs ${CONTAINER_NAME} --tail 50
                '''
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                echo 'Cleaning up old Docker images...'
                sh '''
                    docker image prune -f
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Deployment successful!'
            echo 'Blog is now running at http://next-blog-site.duckdns.org:3000'
        }
        failure {
            echo '❌ Deployment failed!'
            sh '''
                echo "Container logs:"
                docker logs ${CONTAINER_NAME} || echo "No logs available"
            '''
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
