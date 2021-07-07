# m1-spatialaudioplayer-app
Frontend &amp; Backend for serving custom streaming spatial audio players

### Setup
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