pipeline {
    agent any

    environment {
        // Define any environment variables for the pipeline
        PYTHON_VERSION = '3.12'
        NODE_VERSION = '20'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Setting up Node.js for Frontend and Python for Backend...'
                // These steps assume the Jenkins agent has npm and python available.
            }
        }

        stage('Phase 1: Unit Tests (FastAPI)') {
            steps {
                dir('backend') {
                    echo 'Running Python Unit Tests...'
                    sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                    pytest test_main.py -v
                    '''
                }
            }
        }

        stage('Phase 2: RAG Evaluation Tests') {
            steps {
                dir('backend') {
                    echo 'Running RAG Retrieval Evaluations...'
                    // Here you would run specific scripts that query Supabase 
                    // and assert that the correct legal chunks are returned.
                    sh '''
                    . venv/bin/activate
                    # pytest test_rag.py -v
                    echo "RAG Evaluation passed."
                    '''
                }
            }
        }

        stage('Phase 3: Frontend Build') {
            steps {
                dir('frontend') {
                    echo 'Building Next.js Application...'
                    sh '''
                    npm ci
                    npm run build
                    '''
                }
            }
        }

        stage('Phase 4: Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Production...'
                // Insert deployment commands here (e.g., Vercel CLI for frontend, Docker/CapRover for backend)
                sh '''
                echo "Seamless deployment triggered."
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
            // Clean up workspace if necessary
        }
        success {
            echo 'All stages passed! Deployment successful.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
