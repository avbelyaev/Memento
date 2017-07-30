#!/usr/bin/env bash

curl -X POST \
  http://localhost:8888/api/meme/create \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"title": "a wild meme appeared from curl",
	"image": {
		"data": "some data in base64",
		"content_type": "image/png"
	}
}'


curl -X GET \
  http://localhost:8888/api/memes/ \
  -H 'cache-control: no-cache'


curl -X PUT \
  http://localhost:8888/api/meme/10 \
  -H 'cache-control: no-cache' \
  -d '{
	"title": "a wild meme appeared and promised to update 5"
}'