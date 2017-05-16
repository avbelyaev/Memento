#!/bin/sh

db_name=mydb

ins_user() {
    mongo $db_name --eval "db.users.insert({
        _id:        $1,
        name:       '$2',
        login:      '$3',
        email:      '',
        type:       ''
    })"
}

ins_meme() {
    mongo $db_name --eval "db.memes.insert({
        _id:                    $1,
        title:                  '$2',
        image_data: {
            img:                '',
            content_type:       ''
        },
        upload_date:            '',
        rating:                 0
    })"
}

ins_post() {
    mongo $db_name --eval "db.posts.insert({
        _id:                $1,
        title:              '$2',
        meme_id: {
            type:           $3,
            ref:            'meme'
        },
        user_id: {
            type:           $4,
            ref:            'user'
        },
        text: {
            top:            '$5',
            mid:            '',
            bot:            ''
        },
        upload_date:        '',
        rating:             0,
        tags: [{
            tag:            ''
        }]
    })"
}

echo ">>> inserting data"

ins_user 1 "anthony" "anthonybel"
ins_meme 1 "keanu"
ins_post 1 "first\ post" 1 1 "that feeling when..."
