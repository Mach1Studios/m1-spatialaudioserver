FROM node:18 as koa-runtime

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY ./koa-server/package*.json ./
RUN npm ci

COPY ./koa-server .

EXPOSE 3000
VOLUME ["/public"]

CMD ["pm2-runtime", "ecosystem.config.cjs", "--env", "production"]
