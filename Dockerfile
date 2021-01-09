FROM node:current-alpine

WORKDIR /app

RUN apk add python make gcc g++

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json package-lock.json nest-cli.json ./

RUN npm i
RUN npm i -g rimraf @nestjs/cli

COPY src src
COPY scripts scripts
COPY tsconfig.build.json tsconfig.json ./

RUN npm run build

ARG BASE_URL
ARG APP_NAME
ARG KEY
ARG TOKEN

CMD [ "npm","run","start:prod","${BASE_URL}","${APP_NAME}","${KEY}","${TOKEN}"]