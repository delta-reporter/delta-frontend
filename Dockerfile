FROM node:10-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install

ENTRYPOINT ["npm", "run", "dev"]
