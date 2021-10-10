FROM node:14.16 as koa-runtime

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY ./koa-server/package*.json ./
RUN npm ci

COPY ./koa-server .

EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
