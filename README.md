# m1-spatialaudioplayer-app
Frontend &amp; Backend for serving custom streaming spatial audio players

### Setup
Use nvm to setup node `14.16.0`:
- `nvm install 14.16.0`
- `nvm use 14.16.0`

- `cd containers` && `docker build -t m1-transcode .`
- `cd koa-server` && `npm i && npm run local`
- `cd vue-front` && `npm i && npm run serve`

#### Run locally
```
docker run -it \
  -p 1935:1935 \
  -p 8080:80 \
  --mount type=bind,source="$(pwd)/koa-server/public",target=/share/sound \
  --mount type=bind,source="$(pwd)/vue-front/dist",target=/www \
  --name m1-transcode \
  --rm m1-transcode
```