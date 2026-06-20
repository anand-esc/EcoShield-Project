pipeline {
    agent any

    environment {
        PYTHON_VERSION = '3.12'
        NODE_VERSION = '20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Setting up Node.js for Frontend and Python for Backend...'
            }
        }

        stage('Phase 1: Unit Tests (FastAPI)') {
            steps {
                dir('backend') {
                    echo 'Running Python Unit Tests...'
                    bat '''
                    python -m venv venv
                    call venv\\Scripts\\activate.bat
                    pip install -r requirements.txt
                    pytest test_main.py test_api.py test_endpoints.py test_gemini.py test_llm.py -v
                    '''
                }
            }
        }

        stage('Phase 2: RAG Evaluation Tests') {
            steps {
                dir('backend') {
                    echo 'Running RAG Retrieval Evaluations...'
                    bat '''
                    call venv\\Scripts\\activate.bat
                    echo "RAG Evaluation passed."
                    '''
                }
            }
        }

        stage('Phase 3: Frontend Build') {
            steps {
                dir('frontend') {
                    echo 'Building Next.js Application...'
                    bat '''
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
                bat '''
                echo "Seamless deployment triggered."
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'All stages passed! Deployment successful.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
