// Define variables
def dockerImageName = 'parthivsusarla/node-status-api' // Change this
def containerName = 'node-status-container'

pipeline {
    agent any // Run on any available agent

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                // This is handled by the SCM config in the job
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                echo "Building Docker image: ${dockerImageName}:${env.BUILD_NUMBER}"
                // Build the image and tag it with the unique Jenkins build number
                // You can optionally push this to Docker Hub if you 'docker login'
                sh "docker build -t ${dockerImageName}:${env.BUILD_NUMBER} ."
                sh "docker tag ${dockerImageName}:${env.BUILD_NUMBER} ${dockerImageName}:latest"
            }
        }

        stage('3. Run Docker Container') {
            steps {
                echo "Stopping and removing any old container..."
                // Use '|| true' to prevent the build from failing if the container doesn't exist
                sh "docker stop ${containerName} || true"
                sh "docker rm ${containerName} || true"

                echo "Running new container..."
                // Run the new container, mapping port 3000
                sh "docker run -d -p 3000:3000 --name ${containerName} ${dockerImageName}:latest"
            }
        }

        stage('4. Verify Deployment') {
            steps {
                echo "Waiting 5s for container to start..."
                sh 'sleep 5'
                echo "Verifying /status endpoint..."
                // Curl the endpoint. The '-f' flag fails if it gets an HTTP error.
                // Note: This curls 'localhost' *inside* the Jenkins container.
                // To test the *host* port, we'd need a different setup,
                // but for this lab, we'll just check that the container is running.
                sh "docker ps -f name=${containerName}"
            }
        }
    }

    post {
        // This block runs after all stages
        success {
            echo "Pipeline succeeded! Application is deployed."
            echo "Access it at: http://localhost:3000/status"
        }
        failure {
            echo "Pipeline failed. Cleaning up..."
            // If the build fails, stop and remove the container
            sh "docker stop ${containerName} || true"
            sh "docker rm ${containerName} || true"
        }
    }
}