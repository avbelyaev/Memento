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


curl -X GET http://localhost:8888/api/memes/


curl -X GET http://localhost:8888/api/memes/3


curl -X PUT \
  http://localhost:8888/api/memes/5 \
  -d '{
	"title": "another wild meme appeared and did smth"
}'


curl -X DELETE http://localhost:8888/api/memes/4


#posts
curl -X GET http://localhost:8888/api/posts/111