WAR-ready conversion summary
===========================

Changes made programmatically:
- pom.xml packaging set to <packaging>war</packaging> (if pom.xml existed).
- spring-boot-starter-tomcat dependency set to <scope>provided</scope> (added if missing).
- Added ServletInitializer.java to enable external Tomcat deployment.
- Updated main application class to extend SpringBootServletInitializer (if detected).
- Added Dockerfile to build a Tomcat-based container that deploys target/backend.war as ROOT.war.
- Added Jenkinsfile with example stages: build, prepare WAR, build Docker, publish (needs registry credentials).
- Added .env.example for local configuration placeholders.

How to build locally (if you have Maven):
1. mvn clean package
2. cp target/*.war target/backend.war
3. To run standalone: java -jar target/backend.war
4. To deploy on external Tomcat: copy target/backend.war to TOMCAT_HOME/webapps/backend.war (or ROOT.war)

Notes:
- I made best-effort automated edits. Please review the modified files in the new zip.
- I did NOT run mvn here. If you want, you can run 'mvn -X clean package' and paste the errors here and I will iterate further.
