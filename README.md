# m1-spatialaudioserver

Frontend & Backend for serving custom streaming spatial audio players with included web playback example

## Client Endpoint Examples
These are example codebases that are designed to be playback clients for a server deployed by this repo.
- [iOS Client App](https://github.com/Mach1Studios/m1-spatialaudio-client-ios)
- [Web Client Example](https://github.com/Mach1Studios/m1-spatialaudioserver#spatial-player-page)

## Setup

The current stack included 3 docker containers: Nginx server (main transcoder with HLS and DASH support), Redis, and Node.js (API). You can change default environment variables for the dashboard and API, just create `.env` files in `vue-front` and `koa-server` dirs (you can skip this stage):

Default `.env` file for `vue-front`:

```
VUE_APP_API_URL='http://localhost:8080' # the main URL
VUE_APP_STREAM_URL='http://localhost:8080' # additional transcoder URL, the default URL for streaming (hls, dash and rtmp)
VUE_APP_API_PATH='/api' # The default url path for API
```

Default `.env` file for `koa-server`:

```
ADMIN_NICKNAME='m1'
ADMIN_PASSWORD='goodpassbro'
ADMIN_EMAIL='whatsup@mach1.tech'
```


##### Use Makefile commands to setup and build all of them: 

```sh
make build
```

##### Run all containers localy:

```sh
make local
```

More information and command examples you can check in docker containers [documentation](./containers/README.md)

- After launch run `docker network inspect m1-network` to identify the IP address and edit the container ip address found in `./container/nginx/uploader.lua`: `line ~33 redis:connect()`

## Usage

Quickly build and deploy hosted spatial audio experiences & streams designed around Mach1 Spatial and leveraging the Mach1Decode API & Mach1Transcode API to unify playback of all multichannel and spatial audio formats.

### Admin Page

This page is designed for administration over spatial mixes to easily allow users to upload and manage playlists.

![Admin Page](.README/admin-page.png)

### Spatial Player Page

This page acts as a template for the client playback, it will play any existing streams or uploaded content from the Admin Page and is based on <https://github.com/Mach1Studios/m1-web-spatialaudioplayer>

![Spatial Player Page](.README/spatial-player-page.png)

## Development

_This repo is still in development and is deemed experimental and unstable until further notice._

### To Do:

- ~Mach1Transcode audio transcoding support~
- ~Playlisting support~
- ~Https deployment~
- User / Group handling
