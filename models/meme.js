/**
 * Created by anthony on 16.05.17.
 */
const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
var db;//        = require('././db');

var memeSchema = Schema({
    _id: Number,
    title: String,
    //TODO change to Buffer
    //https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose
    image_data:     { img: String, content_type: String },
    upload_date:    { type: Date, default: Date.now() },
    rating:         { type: Number, default: 0 }
});

const meme = mongoose.model('meme', memeSchema);

exports.findByAttr = function(attrName, attrVal) {
    console.log('findByAttr "' + attrName + '==' + attrVal + '"');

    var query = {};
    query[attrName] = attrVal;

    meme.find(query, entriesFoundCallback);
};

exports.findById = function(_id) {
    console.log('findById "' + _id + '"');

    meme.findById(_id, function (err, m) {
        if (err) throw err;

        return m;
    });
};

exports.findByTitle = function(_title) {
    console.log('findByTitle "' + _title + '"');
    meme.find({title: _title}, entriesFoundCallback);
};

exports.findByUploadDateBetween = function(startDate, endDate) {
    console.log('findByUploadDateBetween "' + startDate + '" and "' + endDate + '"');

    var query = {
        'upload_date': {
            '$gte': startDate,
            '$lte': endDate
        }
    };
    meme.find(query, entriesFoundCallback);
};

exports.save = function(_title, _image_data) {
    console.log('attempting to save img data with title "' + _title + '"');

    var m = new meme;
    m.title = _title;
    m.image_data = _image_data;
    
    meme.save(function (err, m1) {
        if (err) throw err;

        console.log('meme "' + _title + '" has been saved');
    });
};

var entriesFoundCallback = function (err, memes) {
    if (err) throw err;

    console.log(memes.length + ' entries have been found');
    return memes;
};