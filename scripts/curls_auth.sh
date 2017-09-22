#!/usr/bin/env bash

curl -X POST \
  http://localhost:8888/api/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"username": "tokyonyquisd",
	"password": "qwerty"
}'

#token is the response. add it to x-auth

curl -X GET \
  http://localhost:8888/api/users/findOneByUsername/tokyonyquisd \
  -H 'cache-control: no-cache' \
  -H 'x-auth: '