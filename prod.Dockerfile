FROM node:12-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ADD . /app
RUN npm install
RUN chmod +x start.sh

ENTRYPOINT ["./start.sh"]
