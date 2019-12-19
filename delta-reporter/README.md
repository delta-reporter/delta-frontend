# Delta Reporter Alpha - Main

Delta Reporter is based on a micro service architecture, as the first micro service is a MVP is just split between backend and frontend

## Backend

- Based on Flask

## Frontend

- Based on NextJS


## Deployment

All the application is dockerized, it can be deployed easily with Docker Compose

`docker-compose build && docker-compose up`

If no errors are met, the environment should be live on:

#### Frontend

- http://localhost:3000/

#### Backend

- http://localhost:5000/ | Delta Websockets Service
- http://localhost:5001/ | Delta Launcher Service
- http://localhost:5002/ | Delta Projects Service
- http://localhost:5003/ | Delta Tests Service
- http://localhost:5004/ | Delta Testsuites Service

#### The server will restart automatically on any change in the code

#### To stop the server at any stage use `docker-compose stop`