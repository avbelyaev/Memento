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
            data:                '',
            content_type:       ''
        },
        rating:                 0,
        is_active:              true
    })"
}

ins_post() {
    mongo $db_name --eval "db.posts.insert({
        _id:                $1,
        title:              '$2',
        meme_id:            $3,
        user_id:            $4,
        text: {
            top:            '$5',
            mid:            '',
            bot:            ''
        },
        rating:             0,
        tags: [{
            tag:            ''
        }]
    })"
}

ins_ctr() {
    mongo $db_name --eval "db.counters.insert({
        _id: '$1'
    })"
}

echo ">>> inserting data"

#ins_user 1 "anthony" "anthonybel"
#ins_user 2 "johnny" "walker"
#ins_user 3 "bilbo" "swaggins"
#ins_user 4 "angela" "mercy"
#ins_user 5 "han" "yolo"

ins_meme 1 "keanu"
ins_meme 2 "social awkward penguin"
ins_meme 3 "man of a culture"
ins_meme 4 "sponge bob imagination"
ins_meme 5 "one cannot simply"
ins_meme 6 "hello there obi-van"
ins_meme 7 "jackie chan"

ins_ctr "meme_id"
ins_ctr "post_id"
ins_ctr "user_id"

ins_post 1 "first post" 1 1 "that feeling when..."
ins_post 2 "tried to make meme generator" 2 1 "have no idea for memes"
ins_post 3 "got a girlfriend" 2 1 "no idea what to do next"
ins_post 4 "learning node" 3 2 "totally forgot how to c++"
ins_post 5 "tryin to destroy dat ring" 5 3 "y cant we use gimlis axe"
ins_post 6 "a wild meme appears" 6 5 "buongiorno sinor kenobi"
ins_post 7 "y tho" 7 1 "americans y dont u add taxes into your price tags"


echo "inserting done"