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
clear: clean

stop:
ifeq ($(shell docker ps -q --filter name="m1*"),)
	# Not found m1 containers
else
	docker container stop $(shell docker ps -q --filter name="m1*")
endif

setup:
	cd koa-server && npm i
	cd vue-front && npm i

build:
	docker build -f ./containers/koa/Dockerfile -t m1-api .
	docker build -f ./containers/nginx/Dockerfile -t m1-transcode .
	docker build -f ./containers/redis/Dockerfile -t m1-redis .

deploy: build
	# deploys build to public AWS bucket
	# NOTE: relies on `mach1` keys in `~/.aws/credentials`

stage: build
	# deploys build to public staging AWS bucket
	# NOTE: relies on `mach1` keys in `~/.aws/credentials`

local: build
	make -i -k stop
	make run_redis_docker
	make run_nginx_docker

run_koa_server:
	cd koa-server && ~/anton/.nvm/nvm.sh use && npm i && npm run local
run_redis_docker:
	docker run -it -p 6379:6379 --name m1-redis --rm m1-redis
run_nginx_docker:
	docker run -it -p 1935:1935 -p 8080:80 --mount type=bind,source="$(shell pwd)/koa-server/public",target=/share/sound --name m1-transcode --rm m1-transcode

development: stop
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_redis_docker"
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_nginx_docker"
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)/koa-server"
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)/vue-front"
