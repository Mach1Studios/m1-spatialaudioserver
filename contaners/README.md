# NGINX Docker Container

## Stack infomation

Stack created from source code and staged with these versions:

-   NGINX **v1.20**
-   NGINX RTMP module **v1.2.1**
-   FFmpeg **v4.4**
-   Redis **v6.2**

## Commands

### NGINX Launch Commands

Building docker image, it commands should be started in ./nginx dir:

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

### The Redis Part

Building docker image, it commands should be started in ./redis dir:

```sh
docker build -t m1-redis .
```

Running container:

```sh
docker run -it \              
  -p 6379:6379 \
  --name m1-redis \
  --rm m1-redis

```

## Additional information about stack

_In Progress..._
