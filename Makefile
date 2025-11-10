# Set shell to sh for cross-platform compatibility (works on Windows with Git Bash/WSL)
SHELL := /bin/sh

LOG_PREFIX := "default"

## getting OS type
ifeq ($(OS),Windows_NT)
	UNAME := Windows
	# On Windows, try multiple methods for generating random string
	# Try PowerShell first, then date+random, then fallback to default
	LOG_PREFIX := $(shell powershell -Command "[System.Web.Security.Membership]::GeneratePassword(6, 0)" 2>nul || date +%s | tail -c 7 2>/dev/null || echo "default")
	# Convert Windows path to format Docker Desktop expects (forward slashes, keep drive letter)
	# Try multiple methods: pwd -W (Git Bash), PowerShell, or fallback to PWD
	PWD_WIN := $(shell pwd -W 2>/dev/null || powershell -Command "(Get-Location).Path -replace '\\\\', '/'" 2>nul || echo "$(PWD)" | sed 's|\\|/|g')
else
	PWD_WIN := $(PWD)
	UNAME := $(shell uname)
	ifeq ($(UNAME), Linux)
		LOG_PREFIX := $(shell tr -dc A-Za-z0-9 </dev/urandom | head -c 6 2>/dev/null || echo "default")
	else ifeq ($(UNAME), Darwin)
		# macOS - use /dev/urandom with LC_ALL=C for compatibility
		LOG_PREFIX := $(shell LC_ALL=C tr -dc A-Za-z0-9 < /dev/urandom | head -c 6 2>/dev/null || echo "default")
	else
		LOG_PREFIX := "default"
	endif
endif

.SILENT: network
network:
ifeq ($(shell docker network ls -q --filter name="m1-network"),)
	@echo "➜ Creating network m1-network..."
ifeq ($(OS),Windows_NT)
	-@docker network create --subnet=172.20.0.0/16 m1-network 2>nul
	-@docker volume create m1-volume 2>nul
else
	-@docker network create --subnet=172.20.0.0/16 m1-network > /dev/null 2>&1
	-@docker volume create m1-volume > /dev/null 2>&1
endif
	@echo "✓ Network and volume created"
else
	@echo "➜ Network m1-network already exists, skipping..."
endif

.SILENT: stop
stop:
	@echo "➜ Stopping m1-spatialaudioserver containers..."
ifeq ($(shell docker ps -q --filter name="m1*"),)
	@echo "➜ No m1 containers found for stop, skipping..."
else
ifeq ($(OS),Windows_NT)
	-@docker container stop $(shell docker ps -q --filter name="m1*") >nul 2>&1
else
	-@docker container stop $(shell docker ps -q --filter name="m1*") > /dev/null 2>&1
endif
endif

.SILENT: clean
clean:
ifeq ($(OS),Windows_NT)
	-@powershell -Command "Remove-Item -Recurse -Force '${PWD}\logs' -ErrorAction SilentlyContinue"
else
	-@rm -rf ${PWD}/logs 2>/dev/null
endif

build: stop
	$(eval COMMIT_HASH=$(shell git rev-parse --short HEAD 2>/dev/null || echo "dev"))
	docker build $(args) --build-arg COMMIT_HASH=$(COMMIT_HASH) -f ./containers/koa/Dockerfile -t m1-api .
	docker build $(args) --build-arg COMMIT_HASH=$(COMMIT_HASH) -f  ./containers/nginx/Dockerfile -t m1-transcode .
	docker build $(args) -f ./containers/redis/Dockerfile -t m1-redis .

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
ifeq ($(OS),Windows_NT)
	@powershell -Command "New-Item -ItemType Directory -Force -Path '${PWD}\logs\$(LOG_PREFIX)' | Out-Null"
else
	@mkdir -p ${PWD}/logs/$(LOG_PREFIX)
endif
	@echo "✓ Created. Logs path: ./logs/$(LOG_PREFIX)"
	@echo "➜ Running docker containers..."
ifeq ($(OS),Windows_NT)
	@echo "  Starting Redis container..."
	@make -s run_redis_docker args="-d --mount type=bind,source=$(PWD_WIN)/containers/redis,target=/redis" || (echo "✗ Failed to start Redis container" && exit 1)
	@echo "  Starting Node.js API container..."
	@make -s run_node_docker args="-d --mount type=bind,source=$(PWD_WIN)/logs/$(LOG_PREFIX),target=/root/.pm2/logs" || (echo "✗ Failed to start Node.js container" && exit 1)
	@echo "  Starting Nginx container..."
	@make -s run_nginx_docker args="-d --mount type=bind,source=$(PWD_WIN)/logs/$(LOG_PREFIX),target=/var/log/nginx" || (echo "✗ Failed to start Nginx container" && exit 1)
else
	-@make -s run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null 2>&1
	-@make -s run_node_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/root/.pm2/logs" > /dev/null 2>&1
	-@make -s run_nginx_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/var/log/nginx" > /dev/null 2>&1
endif
	@echo "✓ All docker containers have been launched"
	@echo "➜ The dashboard is available at this link: http://localhost:80"
	@echo "➜ Note: To stop containers, run: 'make stop'"

.SILENT: local-verbose
local-verbose:
	@echo "➜ Building Docker images with full output (this may take 20-30 minutes)..."
	make build
	make -s network
	@echo "➜ Creating log directory..."
ifeq ($(OS),Windows_NT)
	@powershell -Command "New-Item -ItemType Directory -Force -Path '${PWD}\logs\$(LOG_PREFIX)' | Out-Null"
else
	@mkdir -p ${PWD}/logs/$(LOG_PREFIX)
endif
	@echo "✓ Created. Logs path: ./logs/$(LOG_PREFIX)"
	@echo "➜ Running docker containers..."
ifeq ($(OS),Windows_NT)
	@echo "  Starting Redis container..."
	@make -s run_redis_docker args="-d --mount type=bind,source=$(PWD_WIN)/containers/redis,target=/redis" || (echo "✗ Failed to start Redis container" && exit 1)
	@echo "  Starting Node.js API container..."
	@make -s run_node_docker args="-d --mount type=bind,source=$(PWD_WIN)/logs/$(LOG_PREFIX),target=/root/.pm2/logs" || (echo "✗ Failed to start Node.js container" && exit 1)
	@echo "  Starting Nginx container..."
	@make -s run_nginx_docker args="-d --mount type=bind,source=$(PWD_WIN)/logs/$(LOG_PREFIX),target=/var/log/nginx" || (echo "✗ Failed to start Nginx container" && exit 1)
else
	-@make -s run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null 2>&1
	-@make -s run_node_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/root/.pm2/logs" > /dev/null 2>&1
	-@make -s run_nginx_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/var/log/nginx" > /dev/null 2>&1
endif
	@echo "✓ All docker containers have been launched"
	@echo "➜ The dashboard is available at this link: http://localhost:80"
	@echo "➜ Note: To stop containers, run: 'make stop'"

.SILENT: local-skip-build
local-skip-build:
	make -s stop
	make -s network
	@echo "➜ Creating log directory..."
ifeq ($(OS),Windows_NT)
	@powershell -Command "New-Item -ItemType Directory -Force -Path '${PWD}\logs\$(LOG_PREFIX)' | Out-Null"
else
	@mkdir -p ${PWD}/logs/$(LOG_PREFIX)
endif
	@echo "✓ Created. Logs path: ./logs/$(LOG_PREFIX)"
	@echo "➜ Running docker containers (skipping build)..."
ifeq ($(OS),Windows_NT)
	@echo "  Starting Redis container..."
	@make -s run_redis_docker args="-d --mount type=bind,source=$(PWD_WIN)/containers/redis,target=/redis" || (echo "✗ Failed to start Redis container" && exit 1)
	@echo "  Starting Node.js API container..."
	@make -s run_node_docker args="-d --mount type=bind,source=$(PWD_WIN)/logs/$(LOG_PREFIX),target=/root/.pm2/logs" || (echo "✗ Failed to start Node.js container" && exit 1)
	@echo "  Starting Nginx container..."
	@make -s run_nginx_docker args="-d --mount type=bind,source=$(PWD_WIN)/logs/$(LOG_PREFIX),target=/var/log/nginx" || (echo "✗ Failed to start Nginx container" && exit 1)
else
	-@make -s run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null 2>&1
	-@make -s run_node_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/root/.pm2/logs" > /dev/null 2>&1
	-@make -s run_nginx_docker args="-d --mount type=bind,source=${PWD}/logs/$(LOG_PREFIX),target=/var/log/nginx" > /dev/null 2>&1
endif
	@echo "✓ All docker containers have been launched"
	@echo "➜ The dashboard is available at this link: http://localhost:80"
	@echo "➜ Note: To stop containers, run: 'make stop'"

production: build
	make network
	@echo "➜ Running docker containers in production mode..."
	-@make run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null 2>&1
	-@make run_node_docker args="-d" > /dev/null 2>&1
	-@make run_nginx_docker args="-d" > /dev/null 2>&1
	@echo "✓ All docker containers have been launched"
	@set -a; \
	[ -f config.env ] && . ./config.env 2>/dev/null; \
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
	-@make run_redis_docker args="-d --mount type=bind,source=${PWD}/containers/redis,target=/redis" > /dev/null 2>&1
	-@make run_node_docker args="-d" > /dev/null 2>&1
	-@make run_nginx_docker args="-d" > /dev/null 2>&1
	@echo "✓ All docker containers have been launched"
	@set -a; \
	[ -f config.env ] && . ./config.env 2>/dev/null; \
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
	docker run $(args) \
		--net m1-network \
		--ip 172.20.0.2 \
		--mount type=volume,source=m1-volume,target=/public \
		--name m1-api \
		--rm m1-api || exit 1

.SILENT: run_redis_docker
run_redis_docker:
	docker run -p 6379:6379 $(args) \
		--net m1-network \
		--ip 172.20.0.3 \
		--name m1-redis \
		--rm m1-redis || exit 1

.SILENT: run_nginx_docker	
run_nginx_docker:
ifeq ($(OS),Windows_NT)
	@echo "Starting nginx in HTTP-only mode"
	@docker run -p 1935:1935 -p 80:80 $(args) \
		--net m1-network \
		--ip 172.20.0.4 \
		--mount type=volume,source=m1-volume,target=/share/sound \
		-e ENABLE_SSL=false \
		--name m1-transcode \
		--rm m1-transcode || exit 1
else
	@set -a; \
	[ -f config.env ] && . ./config.env 2>/dev/null; \
	set +a; \
	if [ -n "$$DOMAIN_NAME" ] && [ "$$ENABLE_SSL" = "true" ]; then \
		echo "Starting nginx with SSL for domain: $$DOMAIN_NAME"; \
		docker run -p 1935:1935 -p 80:80 -p 443:443 $(args) \
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
		docker run -p 1935:1935 -p 80:80 $(args) \
			--net m1-network \
			--ip 172.20.0.4 \
			--mount type=volume,source=m1-volume,target=/share/sound \
			-e ENABLE_SSL=false \
			--name m1-transcode \
			--rm m1-transcode; \
	fi
endif

rebuild_nginx_docker:
ifeq ($(shell docker ps -q --filter name="m1-transcode"),)
	# No m1 containers found.
else
	docker container stop m1-transcode
endif
	docker build -f ./containers/nginx/Dockerfile -t m1-transcode .
	@echo "➜ Rebuild complete. Run 'make run_nginx_docker' to start the container."
