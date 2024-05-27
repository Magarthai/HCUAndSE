FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY ./src ./src

RUN npm install
RUN npm run build

COPY .env .

EXPOSE 4000

CMD node ./dist/app.js