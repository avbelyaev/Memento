/**
 * Created by anthony on 16.05.17.
 */
const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;

var memeSchema = Schema({
    _id: Number,
    title: String,
    //TODO change to Buffer
    //https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose
    image_data:     { data: String, content_type: String },
    upload_date:    { type: Date, default: Date.now() },
    rating:         { type: Number, default: 0 }
});

const memeModel = mongoose.model('meme', memeSchema);



exports.findAll = function () {
    console.log('findAll memes');

    memeModel.find({}, entriesFoundCallback);
};

var findByAttr = function(attrName, attrVal, callback) {
    console.log('findByAttr "' + attrName + '==' + attrVal + '"');

    var query = {};
    query[attrName] = attrVal;

    memeModel.find(query, entriesFoundCallback);
    callback();
};

//TODO cant use findById for now since i have explicit _id
exports.findById = function(id, stub) {
    console.log('findById "' + _id + '"');
    if ('number' !== typeof _id)
        console.log('wrong _id type!');

    memeModel.findById(_id, function (err, m) {
        if (err) throw err;

        return m;
    });
};

exports.findById = function (_id, callback) {
    var query = {};
    query["_id"] = _id;

    memeModel.find(query, function (err, memes) {
        if (err) throw err;

        console.log(memes.length + ' entries have been found');
        //this callback is fired only if we get here == entry has been found
        //callback is a function to be passed from rqHandler
        //is composes response and 'memes' from here == 'memesFound' in rqHndlr
        callback(memes);
        return memes;
    });

};

exports.findByTitle = function(_title) {
    console.log('findByTitle "' + _title + '"');
    memeModel.find({title: _title}, entriesFoundCallback);
};

exports.findByUploadDateBetween = function(startDate, endDate) {
    console.log('findByUploadDateBetween "' + startDate + '" and "' + endDate + '"');

    var query = {
        'upload_date': {
            '$gte': startDate,
            '$lte': endDate
        }
    };
    memeModel.find(query, entriesFoundCallback);
};



exports.save = function(_title, _image_data) {
    console.log('attempting to save data data with title "' + _title + '"');

    var m = new memeModel;
    m.title = _title;
    m.image_data = _image_data;
    
    memeModel.save(function (err, m1) {
        if (err) throw err;

        console.log('meme "' + _title + '" has been saved');
    });
};

var entriesFoundCallback = function (err, memes) {
    if (err) throw err;

    console.log(memes.length + ' entries have been found');
    return memes;
};

exports.findByAttr = findByAttr;