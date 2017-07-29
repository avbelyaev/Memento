/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const validatorUtils    = require('../utils/validatorUtils');
const db                = require('../../db');


var memeSchema = Schema({
    _id: Number,
    title: {type: String, required: true },
    //TODO change to Buffer
    //https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose
    //or encode base64
    //https://stackoverflow.com/questions/8110294/nodejs-base64-image-encoding-decoding-not-quite-working
    image: {
        data: { type: String, required: true },
        content_type: { type: String, required: true },
    },
    upload_date: { type: Date, default: Date.now() },
    rating: { type: Number, default: 0 }
});

var counterSchema = Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 0}
});

memeSchema.pre('save', function (next) {
    console.log('meme_id auto inc');
    var docBeingSaved = this;


    counter.findByIdAndUpdate(
        {_id: 'meme_id'},
        {$inc: {seq: 1}},
        function (err, counter) {
            if (err)
                return next(err);
            docBeingSaved._id = counter.seq;
            console.log('id: ' + docBeingSaved._id);

            next();
    });
});

const memeModel = mongoose.model('meme', memeSchema);
const counter = mongoose.model('counter', counterSchema);





var findAll = function (callback) {
    console.log('memes findAll');

    memeModel.find({}, function (err, memes) {
        if (err) throw err;

        console.log(memes.length + ' entries have been found');

        callback(memes ? memes : {});
    });
};



var findOneById = function (id, callback) {
    console.log('meme findOneById "' + id + '"');
    var idVal = id;

    if ('string' === typeof id && validatorUtils.isValidId(id)) {
        try {
            idVal = parseInt(id);
        } catch (e) {
            console.error('error while casting id "' + id + '" to int');
            callback({});
            return;
        }
    } else {
        console.error('error. invalid id: ' + id);
        callback({});
        return;
    }

    findByAttr('_id', idVal, callback);
};



var findByTitle = function(title, callback) {
    console.log('memes findByTitle "' + title + '"');

    findByAttr('title', title, callback);
};



var findByUploadDateBetween = function(startDate, endDate, callback) {
    console.log('findByUploadDateBetween "' + startDate + '" and "' + endDate + '"');

    var query = {
        'upload_date': {
            '$gte': startDate,
            '$lte': endDate
        }
    };

    memeModel.find(query, function (err, memes) {
        if (err) throw err;

        console.log(memes.length + ' entries have been found');
        callback();
    });
};


var save = function (rqBody, callback) {
    var reason, ret = {};
    var meme = new memeModel(rqBody);

    return meme.validate()
        .then(function () {
            console.log('meme is valid');

            return meme.save();
        }, function (err) {
            console.log('here');
        })
        .then(function (newMeme) {
            console.log('created meme');
            ret = newMeme ? newMeme : {};
        })
        .catch(function (e) {
            reason = 'meme model save err: ' + e;
            ret = {};
        })
        .then(function () {
            callback(reason, ret);
        })
};


var findByAttr = function(attrName, attrVal, callback) {
    console.log('memes findByAttr "' + attrName + ':' + attrVal + '"');

    var query = {};
    query[attrName] = attrVal;

    memeModel.find(query, function (err, memes) {
        if (err) throw err;

        callback(memes ? memes : {});
    });
};


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.save = save;