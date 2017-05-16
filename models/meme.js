/**
 * Created by anthony on 16.05.17.
 */
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var db;//        = require('././db');

var memeSchema = Schema({
    _id:                    Number,
    title:                  String,
    image_data: {
        img:                String, //TODO change to buffer
        content_type:       String
    },
    upload_date:            Date,   //TODO change to Date
    rating:                 Number
});

var meme = mongoose.model('meme', memeSchema);