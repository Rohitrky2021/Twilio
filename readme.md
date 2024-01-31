# OpenInApp Backend Task

This Task tries to satisfies all the points assigned in the openinapp backend assignment.

## Tech Stack

**Server:** Node, Express

**Database:** MySql

**Calling Service:** Twilio

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.development file you can use the .env.example and rename it to .env.development

`NODE_ENV` : developemnt or production

`DB_USER` : MySql database user

`DB_PASSWORD` : MySql database password

`DB_NAME` : Database name to be used for this project it can be "openinapp_development"

`DB_HOST` : 127.0.0.1 or host of remote db

`DB_PORT` : 3306 (PORT Number)

`SALT_ROUNDS` : No. of salt rounds for hashing passwords

`BACKEND_SERVICE_PORT` : Backend Service Port e.g. 8000

`JWT_SECRET` : Secret for JWT CREATION e.g. "adasdsd"

`TWILIO_ACCOUNT_SID` : Twilio Account SID

`TWILIO_AUTH_TOKEN` : Twilio Account Auth Token

`TWILIO_PHONE_NUMBER` : Twilio Acccount by which reminder call has to be made

`DEPLOYED_BACKEND_HOST` : Publically accessible host of the backend can be a deployed ip or a ngrok link

## Run Locally

Clone the project

```bash
  git clone https://github.com/Bharat-kr/openinapp-backend-task.git
```

Go to the project directory

```bash
  cd openinapp-backend-task
```

Install dependencies

```bash
  npm install
```

Install Sequelize-cli

```bash
  npm install -g sequelize-cli
```

Setup DB

```bash
  NODE_ENV=developement && npx sequelize-cli db:create
```

> You can change the NODE_ENV if you want to produce a test or a production DB.

if you get error like `NODE_ENV is not a recognised as a internal command`

Install the win-node-env package

```bash
   npm i win-node-env
```

Run Migrations and Seeders

```bash
  npm run db:migrate:up
  npm run db:seed:all
```

Setup ngrok

> open another terminal

```bash
  ngrok http BACKEND_SERVICE_PORT
```

> replace the BACKEND_SERVICE_PORT with the value you have put in env

After creation of the ngrok update the twilio accounts webhook links with `{{ngroklink}}/v1/twilio/voice`

> Update the env DEPLOYED_HOST_NAME with the {{ngroklink}}

Start the server

```bash
  npm run dev
```

## Authors

- [@Bharat-kr](https://www.github.com/Bharat-kr)
