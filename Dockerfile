FROM node:current-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json .

RUN npm i
RUN npm i -g @nestjs/cli

COPY src .
COPY tsconfig.build.json tsconfig.json ./

RUN npm run build


COPY prod.env .

CMD [ "npm","run","start:prod" ]