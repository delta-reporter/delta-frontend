FROM node:12.13.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.2.0 -g

ENTRYPOINT ["npm", "start"]
