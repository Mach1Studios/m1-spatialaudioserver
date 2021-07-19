# Global Enviroment Variable
ARG FFMPEG=4.4
ARG LUA_JIT=2.0.5
ARG LUA_NGINX_MODULE=0.10.19
ARG NGINX_DEV=0.3.1
ARG NGINX=1.20.0
ARG RTMP_MODULE=1.2.1

# NGINX build with RTMP module from source code
FROM ubuntu:focal as nginx-build
ARG LUA_JIT=2.1-20210510
ARG LUA_NGINX_MODULE=0.10.19
ARG LUA_RESTY_CORE=0.1.21
ARG LUA_RESTY_CACHE=0.10
ARG NGINX_DEV=0.3.1
ARG NGINX=1.20.0
ARG RTMP_MODULE=1.2.1

# Install build dependencies for Ubuntu
RUN apt-get update && apt-get install -y \
  build-essential \
  ca-certificates \
  libpcre3-dev \
  libssl-dev \
  openssl \
  wget \
  zlib1g-dev

# Download and extract NGINX
RUN cd /tmp && \
  wget https://nginx.org/download/nginx-${NGINX}.tar.gz && \
  tar zxf nginx-${NGINX}.tar.gz && \
  rm nginx-${NGINX}.tar.gz

# Download and extract RTMP module for NGINX
RUN cd /tmp && \
  wget https://github.com/arut/nginx-rtmp-module/archive/v${RTMP_MODULE}.tar.gz && \
  tar zxf v${RTMP_MODULE}.tar.gz && rm v${RTMP_MODULE}.tar.gz

# Download and extract LuaJIT (all staff for it)
RUN cd /tmp && \
  wget https://github.com/openresty/luajit2/archive/refs/tags/v${LUA_JIT}.tar.gz && \
  wget https://github.com/openresty/lua-nginx-module/archive/refs/tags/v${LUA_NGINX_MODULE}.tar.gz && \
  wget https://github.com/vision5/ngx_devel_kit/archive/refs/tags/v${NGINX_DEV}.tar.gz && \
  wget https://github.com/openresty/lua-resty-core/archive/refs/tags/v${LUA_RESTY_CORE}.tar.gz && \
  wget https://github.com/openresty/lua-resty-lrucache/archive/refs/tags/v${LUA_RESTY_CACHE}.tar.gz && \
  tar zxf v${LUA_JIT}.tar.gz && rm v${LUA_JIT}.tar.gz && \
  tar zxf v${LUA_NGINX_MODULE}.tar.gz && rm v${LUA_NGINX_MODULE}.tar.gz && \
  tar zxf v${LUA_RESTY_CORE}.tar.gz && rm v${LUA_RESTY_CORE}.tar.gz && \
  tar zxf v${LUA_RESTY_CACHE}.tar.gz && rm v${LUA_RESTY_CACHE}.tar.gz && \
  tar zxf v${NGINX_DEV}.tar.gz && rm v${NGINX_DEV}.tar.gz && ls

RUN cd /tmp && ls

# Build LuaJIT
RUN cd /tmp/luajit2-${LUA_JIT} && \
  make PREFIX=/usr/local/luajit && make install PREFIX=/usr/local/luajit

RUN cd /tmp/lua-resty-core-${LUA_RESTY_CORE} && \
  make PREFIX=/usr/local/luajit && make install PREFIX=/usr/local/luajit

RUN cd /tmp/lua-resty-lrucache-${LUA_RESTY_CACHE} && \
  make PREFIX=/usr/local/luajit && make install PREFIX=/usr/local/luajit

RUN cd /usr/local/luajit && \
  ls

# Build NGINX with RTMP module
RUN cd /tmp/nginx-${NGINX} && LUAJIT_LIB=/usr/local/luajit/lib LUAJIT_INC=/usr/local/luajit/include/luajit-2.1 \
  ./configure \
    --prefix=/usr/local/nginx \
    --add-module=/tmp/nginx-rtmp-module-${RTMP_MODULE} \
    --add-module=/tmp/ngx_devel_kit-${NGINX_DEV} \
    --add-module=/tmp/lua-nginx-module-${LUA_NGINX_MODULE} \
    --conf-path=/etc/nginx/nginx.conf \
    --with-threads \
    --with-file-aio \
    --with-http_ssl_module \
    --with-debug \
    --with-cc-opt="-Wimplicit-fallthrough=0" && \
  cd /tmp/nginx-${NGINX} && make && make install

# FFpeg build from source code
FROM ubuntu:focal as ffmpeg-build
ARG FFMPEG
ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=america/new_york

RUN apt-get update && apt-get install -y \
  build-essential \
  cmake \
  libass-dev \
  libfdk-aac-dev \
  libmp3lame-dev \
  libopus-dev \
  libssl-dev \
  libtheora-dev \
  libvorbis-dev \
  libvpx-dev \
  libx264-dev \
  mercurial \
  openssl \
  wget \
  yasm

# Download and extract FFmpeg
RUN cd /tmp && \
  wget http://ffmpeg.org/releases/ffmpeg-${FFMPEG}.tar.gz && \
  tar zxf ffmpeg-${FFMPEG}.tar.gz && rm ffmpeg-${FFMPEG}.tar.gz

# Build FFmpeg without x265 and libwebp modules (should be build from source code first)
RUN cd /tmp/ffmpeg-${FFMPEG} && \
  ./configure \
    --disable-debug \
    --disable-doc \
    --disable-ffplay \
    --enable-avresample \
    --enable-gpl \
    --enable-libass \
    --enable-libfdk-aac \
    --enable-libfreetype \
    --enable-libmp3lame \
    --enable-libopus \
    --enable-libtheora \
    --enable-libvorbis \
    --enable-libvpx \
    --enable-libx264 \
    --enable-nonfree \
    --enable-openssl \
    --enable-postproc \
    --enable-small \
    --enable-version3 \
    --prefix=/usr/local \
    --extra-libs="-lpthread -lm" && \
  make && make install && make distclean

# Core Builds image with NGINX, RTMP and FFmpeg
FROM ubuntu:focal

LABEL MAINTAINER MACH1 <whatsup@mach1.tech>

ENV HTTP_PORT 80
ENV HTTPS_PORT 443
ENV STREAM_PORT 1935

RUN apt-get update && apt-get install -y \
  ca-certificates \
  gettext-base \
  libass9 \
  libfdk-aac1 \
  libmp3lame0 \
  libopus0 \
  libpcre3 \
  libvpx6 \
  openssl \
  libtheora-bin \
  libx264-155 \
  zlib1g

RUN adduser --system --no-create-home --shell /bin/false --group --disabled-login nginx

# Moving all packages from build images to the core instance
COPY --from=nginx-build /usr/local/luajit /usr/local/luajit
COPY --from=nginx-build /usr/local/nginx /usr/local/nginx
COPY --from=nginx-build /etc/nginx /etc/nginx
COPY --from=ffmpeg-build /usr/local /usr/local

VOLUME ["/share/sound"]
VOLUME ["/www"]

# Updating NGINX enviroment
ENV PATH "${PATH}:/usr/local/nginx/sbin"
# Updating Lua enviroment
# ENV LD_LIBRARY_PATH "/usr/local/luajit:$LD_LIBRARY_PATH"

# Adding NGINX configs
COPY nginx.conf /etc/nginx/nginx.conf.template
RUN mkdir -p /opt/data && mkdir -p /opt/data/dash && touch /opt/data/dash/play.mpd

EXPOSE 1935
EXPOSE 80

CMD chown nginx /opt/data/dash && chmod 777 /opt/data/dash && chown -R nginx /share/sound && chmod -R 777 /share/sound && \
 envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" < \
 /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && \
 export LD_LIBRARY_PATH=/usr/local/luajit/lib:$LD_LIBRARY_PATH && \
 nginx