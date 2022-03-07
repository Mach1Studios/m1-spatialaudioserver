s3_bucket_name =
s3_stage_bucket_name =

# getting OS type
ifeq ($(OS),Windows_NT)
	detected_OS := Windows
else
	detected_OS := $(shell uname)
endif

stop:
ifeq ($(shell docker ps -q --filter name="m1*"),)
	# No m1 containers found.
else
	docker container stop $(shell docker ps -q --filter name="m1*")
endif

build: stop
	docker network rm m1-network &> /dev/null
	docker network create m1-network --subnet=172.20.0.0/16 &> /dev/null
	docker volume create m1-volume &> /dev/null
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
	make run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis"
	make run_node_docker args="-d"
	make run_nginx_docker

production: build
	make -i -k stop
	make run_redis_docker args="-d"
	make run_node_docker args="-d"
	make run_nginx_docker args="-d"

run_node_docker:
	docker run -it $$args \
		--net m1-network \
		--ip 172.20.0.2 \
		--mount type=volume,source=m1-volume,target=/public \
		--name m1-api \
		--rm m1-api
run_redis_docker:
	docker run -it -p 6379:6379 $$args \
		--net m1-network \
		--ip 172.20.0.3 \
		--name m1-redis \
		--rm m1-redis
run_nginx_docker:
	docker run -it -p 1935:1935 -p 8080:80 $$args \
		--net m1-network \
		--ip 172.20.0.4 \
		--mount type=volume,source=m1-volume,target=/share/sound \
		--name m1-transcode \
		--rm m1-transcode

# Run development enviroment on eOS ref: https://github.com/elementary/terminal
development: stop
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_redis_docker args=\"--mount type=bind,source=${PWD}/containers/redis,target=/redis\""
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_node_docker args=\"--mount type=bind,source=${PWD}/koa-server,target=/usr/src/app\""
	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_nginx_docker"
	io.elementary.terminal --working-directory="$(shell pwd)/vue-front"

rebuild_nginx_docker:
ifeq ($(shell docker ps -q --filter name="m1-transcode"),)
	# No m1 containers found.
else
	docker container stop m1-transcode
endif
	docker build -f ./containers/nginx/Dockerfile -t m1-transcode .
	io.elementary.terminal --working-directory="$(shell pwd)" --execute="make run_nginx_docker"
