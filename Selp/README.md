Scripts Overview
1. Selp-Login.js
Performs load testing on the login functionality of the Selp module.
Tests user authentication and login API under simulated load conditions.

2. Add-incident.js
Simulates adding new incident records via API calls.
Useful for validating backend handling of incident creation under load.

3. Create-lawyer.js
Tests the API endpoint responsible for creating lawyer profiles.
Ensures the service can handle multiple profile creation requests simultaneously.

4. Add-girls.js
Load tests the feature that adds new girl profiles to the system.
Validates the system’s scalability and response under concurrent additions.

## 📂 Folder Structure
**Selp/** → Load test scripts for the Selp project.

## 🚀 How to Run a Test
Make sure [k6 is installed] 
then run:
k6 run <script-name>.js
