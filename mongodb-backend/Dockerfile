FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY ./src ./src

RUN npm install --production


RUN npm install -g phantomjs --unsafe-perm

COPY .env .

EXPOSE 4000

CMD npm start