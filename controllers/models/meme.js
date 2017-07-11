/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const validatorUtils    = require('../utils/validatorUtils');
const main              = require('../../index');


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

const memeModel = mongoose.model('meme', memeSchema);



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


/*
var create = function(rqBody, callback) {
    var reason = '', retVal = {};
    console.log('meme create. validating');

    var m = memeModel(rqBody);

    m.validate(function (err) {
        if (err) callback(err, retVal);
        console.log('meme valid');

        main.connectToDb(function (db) {
            try {
                getNextId(db, 'meme_id', function (err, result) {
                    if (err) {
                        console.log('error 2');
                        callback(err, retVal);
                    }

                    console.log('id: ' + result + ' of type ' + typeof result);
                    if (result) {
                        rqBody['_id'] = result;

                        memeModel.create(rqBody, function (errCreate, newMeme) {
                            if (errCreate) throw errCreate;

                            console.log('new meme[' + result + ']: ' + newMeme);
                            retVal = newMeme ? newMeme : {};

                            callback(reason, retVal);
                        });
                    } else {
                        reason = 'result is undefined';
                        console.error(reason);

                        callback(reason, retVal);
                    }//
                });
            } catch (e) {
                reason = 'error while getting next Id for meme: ' + e;
                console.error(reason);

                callback(reason, retVal);
            }
        });
    });
};*/

var create = function (rqBody, callback) {
    var reason = '', retVal = {};
    var m = memeModel(rqBody);

    return m.validate()
        .then(function(e1) {
            //asd
        }, function () {
            console.log('meme valeed');

            return main.connectToDb();
        })
        .then(function (db) {
            console.log('db connected');

            return getNextId(db, 'meme_id')
        }, function (e2) {

        })
        .then(function (result) {
            console.log('next id evaluated');

            rqBody['id'] = result;
            return memeModel.create(rqBody);
        })
        .then(function (newMeme) {
            console.log('created meme');
            retVal = newMeme ? newMeme : {};

            callback(reason, retVal);
        });
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

function getNextId(db, name, callback) {
    db.collection('counters').findAndModify(
        { _id: name }, null, { $inc: { seq: 1 } },
        function(err, result) {
            if (err) callback(err, result);
            console.log('getting id');
            callback(err, result.value.seq);
        }
    );
}


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.create = create;