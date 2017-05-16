#!/bin/sh

db_name=mydb

#create(collection)
create() {
    echo ">>> creating collection '$1'"
    mongo $db_name --eval "db.createCollection('$1')"
}

echo ">>> dropping db '$db_name'"
mongo $db_name --eval "db.dropDatabase()"

echo ">>> creating db '$db_name'"
mongo --eval "db.getSiblingDB('$db_name')"

create "users"
create "memes"
create "posts"

