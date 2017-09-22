#!/usr/bin/env bash

curl -X POST \
  http://localhost:8888/api/memes/create \
  -H 'content-type: application/json' \
  -d '{
	"title": "a wild meme appeared from curl",
	"image": {
		"data": "some data in base64",
		"content_type": "image/png"
	}
}'


curl http://localhost:8888/api/memes/


curl http://localhost:8888/api/memes/3


curl -X PUT \
  http://localhost:8888/api/memes/5 \
  -d '{
	"title": "another wild meme appeared and did smth"
}'


curl -X DELETE http://localhost:8888/api/memes/4


#posts
curl http://localhost:8888/api/posts/111



#users
curl -X POST \
  http://localhost:8888/api/users/create \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 549ce871-9243-08a0-15ef-f3fc7859b41e' \
  -d '{
	"first_name": "anthony",
	"last_name": "b",
	"username": "init_user",
	"email": "overlord228@ya.ru",
	"password": "qwerty"
}'

curl localhost:8888/api/users