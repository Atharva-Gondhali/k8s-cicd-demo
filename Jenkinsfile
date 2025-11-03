// Jenkinsfile

pipeline {
    agent any
    
    // Define the branch specific environment variables
    environment {
        // Use a unique tag based on the Git commit SHA for images
        COMMIT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        IMAGE_TAG = "v${COMMIT_SHA}"
        
        // Replace with your DockerHub username
        DOCKERHUB_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKERHUB_REPO = 'atharvag24/student-dashboard'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the image using the short SHA as the tag
                    sh "docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} ."
                    
                    // Tag the image with 'latest' for convenience
                    sh "docker tag ${DOCKERHUB_REPO}:${IMAGE_TAG} ${DOCKERHUB_REPO}:latest"
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                script {
                    // Use the defined credential ID to authenticate
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS_ID) {
                        docker.image("${DOCKERHUB_REPO}:${IMAGE_TAG}").push()
                        docker.image("${DOCKERHUB_REPO}:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def environmentName = ''
                    def namespace = ''
                    
                    // --- Branch Strategy Implementation: dev -> test, main -> production ---
                    if (env.BRANCH_NAME == 'dev') {
                        environmentName = 'Test'
                        namespace = 'test'
                    } else if (env.BRANCH_NAME == 'main') {
                        environmentName = 'Production'
                        namespace = 'production'
                    }
                    
                    if (namespace) {
                        echo "Deploying to the **${environmentName}** environment (**${namespace}** namespace)."
                        
                        // Use sh commands to modify the deployment.yaml for the specific deployment
                        // 1. Update the image tag (crucial for rolling updates)
                        sh "sed -i 's|image: YOUR_DOCKERHUB_USERNAME/student-dashboard:latest|image: ${DOCKERHUB_REPO}:${IMAGE_TAG}|g' deployment.yaml"
                        
                        // 2. Update the ENVIRONMENT variable in the manifest (for the app to display)
                        sh "sed -i 's|value: \"dynamic-env\"|value: \"${environmentName}\"|g' deployment.yaml"
                        
                        // 3. Update the COMMIT_SHA variable (for the app to display)
                        sh "sed -i 's|value: \"dynamic-sha\"|value: \"${COMMIT_SHA}\"|g' deployment.yaml"
                        
                        // 4. Apply the deployment to Kubernetes
                        sh "kubectl apply -f deployment.yaml --namespace=${namespace}"
                    } else {
                        echo "Skipping deployment. Branch ${env.BRANCH_NAME} is not configured for deployment."
                    }
                }
            }
        }
    }
}
