/**
 * Created by anthony on 16.05.17.
 */
var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var ObjId       = Schema.Types.ObjectId;
var db;//        = require('././db');

var postSchema = Schema({
    _id: Number,
    title: String,
    meme_id: { type: Number, ref: 'meme' },
    user_id: { type: Number, ref: 'user' },
    text: { type: Number },
    create_datetime: { type: Date, default: Date.now() },
    rating: Number,
    tags: [{ tag: String }]
});

var post = mongoose.model('post', postSchema);

function stub1() {

}

function stub2() {

}

module.exports = {
    stub1, stub2
};