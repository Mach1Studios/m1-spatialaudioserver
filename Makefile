# https://mach1.tech resolves to:
s3_bucket_name =
s3_stage_bucket_name = 

# getting OS type
ifeq ($(OS),Windows_NT)
	detected_OS := Windows
else
	detected_OS := $(shell uname)
endif

clean:
	cd vue-front && rm -rf ./node_modules
	cd koa-server && rm -rf ./node_modules
clear: clean

setup:
	cd koa-server && npm i
	cd vue-front && npm i

build:
	cd containers/nginx && docker build -t m1-transcode .
	cd containers/redis && docker build -t m1-redis .
	cd vue-front && npm i && npm run build

deploy: build
	# deploys build to public AWS bucket
	# NOTE: relies on `mach1` keys in `~/.aws/credentials`

stage: build
	# deploys build to public staging AWS bucket
	# NOTE: relies on `mach1` keys in `~/.aws/credentials`

local: build
	# runs run commands in parallel
	make -j run_redis_docker run_koa_server run_docker

run_koa_server: 
	cd koa-server && npm i && npm run local
run_redis_docker:
	cd containers/redis && docker run -it -p 6379:6379 --name m1-redis --rm m1-redis
run_docker:
	docker run -it -p 1935:1935 -p 8080:80 --mount type=bind,source="$(shell pwd)/koa-server/public",target=/share/sound --mount type=bind,source="$(shell pwd)/vue-front/dist",target=/www --name m1-transcode --rm m1-transcode