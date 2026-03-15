pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'mvn clean package -DskipTests'
      }
    }
    stage('Prepare WAR') {
      steps {
        // ensure artifact is named backend.war
        sh 'cp target/*.war target/backend.war || true'
      }
    }
    stage('Build Docker') {
      steps {
        sh 'docker build -t myrepo/backend:${BUILD_NUMBER} -f Dockerfile .'
      }
    }
    stage('Publish') {
      steps {
        echo 'Add steps to push image to registry or deploy to Tomcat'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'target/backend.war', fingerprint: true
    }
  }
}
