LOG_PREFIX := "default"

## getting OS type
ifeq ($(OS),Windows_NT)
	UNAME := Windows
else
	UNAME := $(shell uname)
endif

ifeq ($(UNAME), Linux)
	LOG_PREFIX := $(shell tr -dc A-Za-z0-9 </dev/urandom | head -c 6; echo)
endif

.SILENT: network
network:
ifeq ($(shell docker network ls -q --filter name="m1-network"),)
	@echo "➜ Creating network m1-network..."
	docker network create --subnet=172.20.0.0/16 m1-network &> /dev/null
	docker volume create m1-volume &> /dev/null
	@echo "✓ Network and volume created"
else
	@echo "➜ Network m1-network already exists, skipping..."
endif

.SILENT: stop
stop:
ifeq ($(shell docker ps -q --filter name="m1*"),)
	@echo "➜ No m1 containers found for stop, skipping..."
else
	docker container stop $(shell docker ps -q --filter name="m1*") &> /dev/null
endif

.SILENT: clean
clean:
	rm -rf ${PWD}/logs

build: stop
	$(eval COMMIT_HASH=$(shell git rev-parse --short HEAD 2>/dev/null || echo "dev"))
	docker build $$args --build-arg COMMIT_HASH=$(COMMIT_HASH) -f ./containers/koa/Dockerfile -t m1-api .
	docker build $$args --build-arg COMMIT_HASH=$(COMMIT_HASH) -f  ./containers/nginx/Dockerfile -t m1-transcode .
	docker build $$args -f ./containers/redis/Dockerfile -t m1-redis .

deploy: build
	# deploys build to public AWS bucket
	# NOTE: relies on `mach1` keys in `~/.aws/credentials`

stage: build
	# deploys build to public staging AWS bucket
	# NOTE: relies on `mach1` keys in `~/.aws/credentials`

.SILENT: local
local:
	@echo "➜ Building Docker images (this may take 20-30 minutes on first run)..."
	make build args="-q"
	make -s network
	@echo "➜ Creating log directory..."
	mkdir -p ${PWD}/logs/$(LOG_PREFIX)
	@echo "✓ Created. Logs path: ./logs/$(LOG_PREFIX)"
	@echo "➜ Running docker containers..."
	make -s run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null
	make -s run_node_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/root/.pm2/logs" > /dev/null
	make -s run_nginx_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/var/log/nginx" > /dev/null
	@echo "✓ All docker containers have been launched"
	@echo "➜ The dashboard is available at this link: http://localhost:80"
	@echo "➜ Note: To stop containers, run: 'make stop'"

.SILENT: local-verbose
local-verbose:
	@echo "➜ Building Docker images with full output (this may take 20-30 minutes)..."
	make build
	make -s network
	@echo "➜ Creating log directory..."
	mkdir -p ${PWD}/logs/$(LOG_PREFIX)
	@echo "✓ Created. Logs path: ./logs/$(LOG_PREFIX)"
	@echo "➜ Running docker containers..."
	make -s run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null
	make -s run_node_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/root/.pm2/logs" > /dev/null
	make -s run_nginx_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/var/log/nginx" > /dev/null
	@echo "✓ All docker containers have been launched"
	@echo "➜ The dashboard is available at this link: http://localhost:80"
	@echo "➜ Note: To stop containers, run: 'make stop'"

.SILENT: local-skip-build
local-skip-build:
	make -s stop
	make -s network
	@echo "➜ Creating log directory..."
	mkdir -p ${PWD}/logs/$(LOG_PREFIX)
	@echo "✓ Created. Logs path: ./logs/$(LOG_PREFIX)"
	@echo "➜ Running docker containers (skipping build)..."
	make -s run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null
	make -s run_node_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/root/.pm2/logs" > /dev/null
	make -s run_nginx_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/var/log/nginx" > /dev/null
	@echo "✓ All docker containers have been launched"
	@echo "➜ The dashboard is available at this link: http://localhost:80"
	@echo "➜ Note: To stop containers, run: 'make stop'"

production: build
	make network
	@echo "➜ Running docker containers in production mode..."
	make run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null
	make run_node_docker args="-d" > /dev/null
	make run_nginx_docker args="-d" > /dev/null
	@echo "✓ All docker containers have been launched"
	@set -a; \
	[ -f config.env ] && . ./config.env; \
	set +a; \
	if [ -n "$$DOMAIN_NAME" ]; then \
		echo "➜ The dashboard should be available at: https://$$DOMAIN_NAME"; \
	else \
		echo "➜ The dashboard should be available at: http://$(shell curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')"; \
	fi; \
	if [ "$$ENABLE_SSL" = "true" ]; then \
		echo "➜ Note: Make sure ports 80 and 443 are open in your EC2 security group"; \
	else \
		echo "➜ Note: Make sure port 80 is open in your EC2 security group"; \
	fi
	@echo "➜ To stop containers, run: 'make stop'"

.SILENT: production-skip-build
production-skip-build:
	make -s stop
	make network
	@echo "➜ Running docker containers in production mode (skipping build)..."
	make run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null
	make run_node_docker args="-d" > /dev/null
	make run_nginx_docker args="-d" > /dev/null
	@echo "✓ All docker containers have been launched"
	@set -a; \
	[ -f config.env ] && . ./config.env; \
	set +a; \
	if [ -n "$$DOMAIN_NAME" ]; then \
		echo "➜ The dashboard should be available at: https://$$DOMAIN_NAME"; \
	else \
		echo "➜ The dashboard should be available at: http://$(shell curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')"; \
	fi; \
	if [ "$$ENABLE_SSL" = "true" ]; then \
		echo "➜ Note: Make sure ports 80 and 443 are open in your EC2 security group"; \
	else \
		echo "➜ Note: Make sure port 80 is open in your EC2 security group"; \
	fi
	@echo "➜ To stop containers, run: 'make stop'"

.SILENT: run_node_docker
run_node_docker:
	docker run -it $$args \
		--net m1-network \
		--ip 172.20.0.2 \
		--mount type=volume,source=m1-volume,target=/public \
		--name m1-api \
		--rm m1-api

.SILENT: run_redis_docker
run_redis_docker:
	docker run -it -p 6379:6379 $$args \
		--net m1-network \
		--ip 172.20.0.3 \
		--name m1-redis \
		--rm m1-redis

.SILENT: run_nginx_docker	
run_nginx_docker:
	@set -a; \
	[ -f config.env ] && . ./config.env; \
	set +a; \
	if [ -n "$$DOMAIN_NAME" ] && [ "$$ENABLE_SSL" = "true" ]; then \
		echo "Starting nginx with SSL for domain: $$DOMAIN_NAME"; \
		docker run -it -p 1935:1935 -p 80:80 -p 443:443 $$args \
			--net m1-network \
			--ip 172.20.0.4 \
			--mount type=volume,source=m1-volume,target=/share/sound \
			--mount type=bind,source=/etc/letsencrypt,target=/etc/letsencrypt,readonly \
			-e DOMAIN_NAME=$$DOMAIN_NAME \
			-e ENABLE_SSL=true \
			--name m1-transcode \
			--rm m1-transcode; \
	else \
		echo "Starting nginx in HTTP-only mode"; \
		docker run -it -p 1935:1935 -p 80:80 $$args \
			--net m1-network \
			--ip 172.20.0.4 \
			--mount type=volume,source=m1-volume,target=/share/sound \
			-e ENABLE_SSL=false \
			--name m1-transcode \
			--rm m1-transcode; \
	fi

rebuild_nginx_docker:
ifeq ($(shell docker ps -q --filter name="m1-transcode"),)
	# No m1 containers found.
else
	docker container stop m1-transcode
endif
	docker build -f ./containers/nginx/Dockerfile -t m1-transcode .
	io.elementary.terminal --working-directory="$(shell pwd)" --execute="make run_nginx_docker"
