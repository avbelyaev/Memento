/**
 * Created by anthony on 16.05.17.
 */
var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var db;//        = require('././db');

var postSchema = mongoose.Schema({
    _id:                Number,
    title:              String,
    meme_id: {
        type:           Number,
        ref:            'meme'
    },
    user_id: {
        type:           Number,
        ref:            'user'
    },
    text: {
        top:            String,
        mid:            String,
        bot:            String
    },
    upload_date:        String, //TODO change to Date
    rating:             Number,
    tags: [{
        tag:            String
    }]
});

var post = mongoose.model('post', postSchema);