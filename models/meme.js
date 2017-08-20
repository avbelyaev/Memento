/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const validatorUtils    = require('../utils/validatorUtils');
const db                = require('../db');
const counter           = require('./counter');
const log               = require('winston');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const InternalError     = require('../utils/errors/InternalError');


const memeSchema = Schema({
    _id: Number,
    is_active: { type: Boolean, default: true },
    title: { type: String, required: true },
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
}, {
    strict: 'throw' //fails on unknown fields in rqBody
});

memeSchema.pre('save', function (next) {
    log.info('meme_id inc');
    var docBeingSaved = this;


    counter.findByIdAndUpdate(
        {_id: 'meme_id'},
        {$inc: {seq: 1}},
        function (err, counter) {
            if (err)
                return next(err);
            docBeingSaved._id = counter.seq;
            log.info('id: ' + docBeingSaved._id);

            next();
    });
});

const memeModel = mongoose.model('meme', memeSchema);




var ret = null;

function dbConnError(callback) {
    var errMsg = 'DB connection error';
    log.error(errMsg);
    callback(new InternalError({message: errMsg}), null);
}

var findByAttr = function(attrName, attrVal, callback) {
    log.info('memes findByAttr [' + attrName + ':' + attrVal + ']');

    var query = {};
    query[attrName] = attrVal;

    memeModel.find(query, function (err, memes) {
        if (err) {
            err = new InternalError(err);
            ret = null;

        } else {
            ret = memes ? memes : [];
        }
        callback(err, ret);
    });
};




var findAll = function (callback) {
    log.info('memes findAll');

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        memeModel.find({}, function (err, memes) {
            if (err) {
                err = new InternalError(err);
            } else {

                log.info('entries found: ' + memes.length);
                ret = memes ? memes : [];
            }
            callback(err, ret);
        });
    }
};



var findOneById = function (idVal, callback) {
    log.info('meme findOneById [' + idVal + ']');

    var id;
    try {
        id = validatorUtils.validateAndConvertId(idVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        return findByAttr('_id', id, function (err, memesFound) {
            var error = ret = null;

            if (err) {
                error = new InternalError(err);

            } else {
                if (memesFound && 1 === memesFound.length) {
                    ret = memesFound;

                } else {
                    error = new DocNotFoundError({
                        message: 'not found'
                    });
                    ret = null;
                }
            }
            callback(error, ret);
        });
    }
};



var findByTitle = function(title, callback) {
    log.info('memes findByTitle "' + title + '"');

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        findByAttr('title', title, callback);
    }
};



var findByUploadDateBetween = function(startDate, endDate, callback) {
    log.error('NOT IMPLEMENTED');
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
    log.info('meme model save');

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        var meme;
        try {
            meme = new memeModel(rqBody);
        } catch(e) {
            log.error(e.message);
            callback(new ValidationError(e), null);
            return;
        }

        ret = null;

        return meme
            .validate()
            .then(function () {

                log.info('meme data is valid. saving');
                return meme.save();

            }, function (err) {
                throw new ValidationError(err);
            })
            .then(function (newMeme) {

                if (newMeme) {
                    log.info('meme has been saved');
                    ret = newMeme;

                } else {
                    throw new DocNotFoundError({message: 'new meme not found'});
                }
            })
            .then(function () {
                callback(null, ret);
            })
            .catch(function (e) {
                log.error('meme model save err: ', e.message);

                callback(e, null);
            })

    }
};



var update = function (idVal, rqBody, callback) {
    log.info('meme model update by id [' + idVal + ']');

    var id;
    try {
        id = validatorUtils.validateAndConvertId(idVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    if (!db.isConnected()) {
        dbConnError(callback);

    } else {

        try {
            //validate against schema
            var tmp = new memeModel(rqBody);
        } catch(e) {
            log.error(e.message);
            callback(new ValidationError(e), null);
            return;
        }

        ret = null;

        return memeModel
            .update({_id: id}, {$set: rqBody})
            .exec()
            .then(function(affected) {
                log.info('entries affected: ', affected);

                if (0 !== affected.n) {
                    //if any was affected then find what was it
                    return memeModel
                        .findOne({_id: id})
                        .exec()

                } else {
                    if (0 === affected.ok) {
                        //0 === OK when entry can't be updated
                        //then assume rqBody is incorrect
                        throw new ValidationError({message: 'cannot be updated'});
                    } else {
                        //otherwise no doc was updated
                        throw new DocNotFoundError({message: 'nothing was updated'});
                    }
                }
            })
            .then(function (updatedMeme) {

                if (updatedMeme) {
                    log.info('updated meme found');
                    ret = updatedMeme;

                } else {
                    throw new DocNotFoundError({message: 'updated meme not found'});
                }
            })
            .then(function () {
                callback(null, ret);
            })
            .catch(function (e) {
                log.error('meme model update err: ', e.message);

                callback(e, null);
            })

    }
};


var memeDelete = function (idVal, callback) {
    log.info('meme model delete by id [' + idVal + ']');

    var inactiveMeme = {};
    inactiveMeme['is_active'] = false;

    log.info('try safe delete by setting is_active=false');
    update(idVal, inactiveMeme, callback);
};


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.save = save;
exports.update = update;
exports.delete = memeDelete;