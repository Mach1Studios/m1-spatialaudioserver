FROM redis:6.2-alpine

WORKDIR /usr/local/etc/redis
COPY ./containers/redis/redis.conf ./

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
