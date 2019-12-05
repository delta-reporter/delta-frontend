# Delta Reporter Alpha - Main

Delta Reporter is based on a micro service architecture, as the first micro service is a MVP is just split between backend and frontend

## Backend

- Based on Golang

## Frontend

- Based on React


## Deployment

All the application is dockerized, it can be deployed easily with Docker Compose

`docker-compose build && docker-compose up`

If no errors are met, the environment should be live on:

#### Frontend

- http://localhost:3000/

#### Backend

- http://localhost:8080/

#### The server will restart automatically on any change in the code

#### To stop the server at any stage use `docker-compose stop`