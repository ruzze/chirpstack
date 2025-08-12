.PHONY: build server dependencies clean

build: dependencies
	yarn build

server: dependencies relink-api
	yarn start

dependencies:
	yarn install
	yarn add file:../api/grpc-web

clean:
	rm -rf build

format:
	./node_modules/.bin/prettier --write .

relink-api:
	yarn upgrade @chirpstack/chirpstack-api-grpc-web