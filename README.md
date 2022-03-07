# m1-spatialaudioserver

Frontend & Backend for serving custom streaming spatial audio players with included web playback example

### Setup

Use nvm to setup node `14.16.0`:

-   `nvm install 14.16.0`
-   `nvm use 14.16.0`

-   `cd containers/nginx` && `docker build -t m1-transcode .`
-   `cd containers/redis` && `docker build -t m1-redis .`
-   `cd koa-server` && `npm i && npm run local`
-   `cd vue-front` && `npm i && npm run build`

#### Run locally
```sh
make local
```

More information and command examples you can check in docker containers [documentation](./containers/README.md)

- After launch run `docker network inspect m1-network` to identify the IP address and edit the container ip address found in `./container/nginx/uploader.lua`: `line ~33 redis:connect()`

### Usage

Quickly build and deploy hosted spatial audio experiences & streams designed around Mach1 Spatial and leveraging the Mach1Decode API & Mach1Transcode API to unify playback of all multichannel and spatial audio formats.

#### Admin Page

This page is designed for administration over spatial mixes to easily allow users to upload and manage playlists.

![Admin Page](.README/admin-page.png)

#### Spatial Player Page

This page acts as a template for the client playback, it will play any existing streams or uploaded content from the Admin Page and is based on <https://github.com/Mach1Studios/m1-web-spatialaudioplayer>

![Spatial Player Page](.README/spatial-player-page.png)

### Development

_This repo is still in development and is deemed experimental and unstable until further notice._

#### To Do:

-   Mach1Transcode audio transcoding support
-   Playlisting support
-   Https deployment
-   User / Group handling

#### Software Design

![Software Design](.README/Software.png)
