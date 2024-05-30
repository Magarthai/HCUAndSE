FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY ./src ./src

RUN npm install

RUN npm -g install phantomjs-prebuilt
COPY .env .

EXPOSE 4000

CMD npm start