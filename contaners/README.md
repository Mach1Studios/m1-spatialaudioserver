# NGINX Docker Container

## Stack infomation

Stack created from source code and staged with these versions:

-   NGINX **v1.20**
-   NGINX RTMP module **v1.2.1**
-   FFmpeg **v4.4**

## Commands

Building docker image:

```sh
docker build -t m1-transcode .
```

Running container:

```sh
docker run -it -p 1935:1935 -p 8080:80 --rm m1-transcode
```

Running container and share uploaded sound files:

```sh
docker run -it -p 1935:1935 -p 8080:80 --mount type=bind,source="$(pwd)/koa-server/public",target=/share/sound --rm m1-transcode
```

or

```sh
docker run -it \
  -p 1935:1935 \
  -p 8080:80 \
  --mount type=bind,source="$(pwd)/koa-server/public",target=/share/sound \
  --mount type=bind,source="$(pwd)/vue-front/dist",target=/www \
  --name m1-transcode \
  --rm m1-transcode
```

## Additional information about stack

_In Progress..._
