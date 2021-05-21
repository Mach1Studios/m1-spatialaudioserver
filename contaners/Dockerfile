# Global Enviroment Variable
ARG NGINX=1.20.0
ARG RTMP_MODULE=1.2.1
ARG FFMPEG=4.4

# NGINX build with RTMP module from source code
FROM ubuntu:focal as nginx-build
ARG NGINX
ARG RTMP_MODULE

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

# Build NGINX with RTMP module
RUN cd /tmp/nginx-${NGINX} && \
  ./configure \
    --prefix=/usr/local/nginx \
    --add-module=/tmp/nginx-rtmp-module-${RTMP_MODULE} \
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

ENV TZ=Europe/Moscow

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

LABEL MAINTAINER MACH1 <support@mach1.tech>

ENV HTTP_PORT 80
ENV HTTPS_PORT 443
ENV STREAM_PORT 1935

RUN apt-get update && apt-get install -y \
  ca-certificates \
  gettext-base \
  libpcre3 \
  openssl \
  zlib1g

RUN adduser --system --no-create-home --shell /bin/false --group --disabled-login nginx

# Moving all packages from build images to the core instance
COPY --from=nginx-build /usr/local/nginx /usr/local/nginx
COPY --from=nginx-build /etc/nginx /etc/nginx
COPY --from=ffmpeg-build /usr/local /usr/local

VOLUME ['/share/sound']

# Updating NGINX enviroment
ENV PATH "${PATH}:/usr/local/nginx/sbin"

# Adding NGINX configs
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf.template
RUN mkdir -p /opt/data && mkdir -p /www && mkdir -p /opt/data/dash

EXPOSE 1935
EXPOSE 80

CMD chown nginx /opt/data/dash && chmod 777 /opt/data/dash && \
 envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" < \
 /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && \
 nginx
