FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY ./src ./src

RUN npm install

COPY .env .

EXPOSE 5000

CMD npm start