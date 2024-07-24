## FRONTEND SETUP

1. npm i

2. create a .env file inside the Frontend directory and add the below credentials
   REACT_APP_BACKEND_URL = "http://localhost:5000/"

3. npm run dev

## BACKEND SETUP

1. Environment Variables

   -> change the DB_URL in docker-compose.yml
   (i) DB_URL should be in this format: "postgresql://username:password@host:port/database"

2. Build and Start Containers

   -> docker-compose up --build flask_app

3. Verify Containers

   Once the containers are up, you can verify their status with:

   "docker ps"

4. Access the Flask Application

   Open your web browser and navigate to http://localhost:5000 to access the Flask application.]


![Screenshot 2024-07-24 121755](https://github.com/user-attachments/assets/ce6f333c-5f0f-424b-9b97-e129ca4b5f10)

