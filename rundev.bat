@echo off
set NODE_ENV=development
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=openinapp_development
set DB_HOST=127.0.0.1
set DB_PORT=3306
set SALT_ROUNDS=10
set BACKEND_SERVICE_PORT=8000
set JWT_SECRET=iamadevelsds
set TWILIO_ACCOUNT_SID=
set TWILIO_AUTH_TOKEN=
set TWILIO_PHONE_NUMBER=
set DEPLOYED_BACKEND_HOST=https://bbe4-2405-204-1296-c111-41d3-34f6-207a-d76f.ngrok-free.app

 nodemon src/index.js --watch .
