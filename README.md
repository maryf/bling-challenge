## Bling Task

## Install Dependencies
```console
$ npm install
```
## Configure Environment Variables

Create a copy of the env.development file in the root of the project and name it .env. Replace the variables with your credentials.

## Run the database

Run in the root folder of the project the command: 
```console
$ docker compose up -d
```
This command will create a docker container running mysql.

## Initialize Prisma

```console
$ npx prisma generate
$ npx prisma migrate dev
```
You will then have created a mysql database called bling-challenge with the User table.

## Start the server

```console
$ npx ts-node server.ts
```
## Examples

Register user:
```console
$ curl --http0.9 -H 'Content-Type: application/json' \
      -d '{ "name":"Mary", "mobile":"+491721676965", "email":"mary@test.com", "password": "RanD0mPass3^"}' \
      -X POST \
      http://localhost:3000/api/auth/register
```
## How the user login flow works

The user submits their email and password to the /login endpoint.
The app verifies the credentials and, if valid, generates an OTP and sends it to the user's registered mobile number.
The user is informed that an OTP has been sent.

OTP Verification:

The user receives the OTP on their mobile device.
The user submits the OTP together with their email to the /verify-otp endpoint.
The endpoint verifies the OTP against what was sent and stored for that user.

Token Generation:

If the OTP is valid, the server generates a JWT for the user.
The JWT is sent to the user in the response, which they can use for authenticated requests.

