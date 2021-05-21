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

Runninh container:

```sh
docker run -it -p 1935:1935 -p 8080:80 --rm m1-transcode
```

## Additional information about stack

_In Progress..._
