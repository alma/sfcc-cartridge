.DEFAULT_GOAL := help
.PHONY: help, up, stop, remove, test, build, lint, upload

help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-15s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
## Container management
##---------------------------------------------------------------------------
up: ## Up Node.js container
	docker-compose -f .docker/docker-compose.yml up -d --build;

stop: ## Stop Node.js container
	docker-compose -f .docker/docker-compose.yml stop;

remove: ## Delete Node.js container
	docker-compose -f .docker/docker-compose.yml down;

connect: ## Connect to Node.js container
	docker exec -it -u node sfcc-script '/bin/bash'

##
## Alma plugin commands
##---------------------------------------------------------------------------
build: ## Build metadata .zip file (based on .env file)
	docker exec -it -u node sfcc-script sh -c 'npm run build'

test: ## Launch unit tests
	docker exec -it -u node sfcc-script sh -c 'npm run test'

lint: ## check js files linting
	docker exec -it -u node sfcc-script sh -c 'npm run lint:js'

upload: ## upload cartidge to sandbox (from dw.json settings)
	docker exec -it -u node sfcc-script sh -c 'npm run uploadCartridge'
