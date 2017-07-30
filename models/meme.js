/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const validatorUtils    = require('../utils/validatorUtils');
const db                = require('../db');
const log               = require('winston');
const AppError          = require('../utils/errors/AppError');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');


const memeSchema = Schema({
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
    rating: { type: Number, default: 0 },
    is_active: {type: Boolean, default: true }
});

const counterSchema = Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 0}
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
const counter = mongoose.model('counter', counterSchema);




var errMsg = null, ret = null;

function dbConnError(callback) {
    errMsg = 'db connection err';
    log.error('meme model: ' + errMsg);
    callback(errMsg, null);
}

function emptyObjError(callback) {
    errMsg = 'request body is empty';
    log.error('meme model: ' + errMsg);
    callback(errMsg, null);
}

function validate(idVal, callback) {
    var id;
    if ('string' === typeof idVal && validatorUtils.isValidId(idVal)) {
        try {
            id = parseInt(idVal);
        } catch (e) {
            log.error('id cast error');
            callback(e, null);
            return;
        }
    } else {
        errMsg = 'invalid id value/type: ' + idVal;
        log.error(errMsg);
        callback(errMsg, null);
        return;
    }
    return id;
}

var findByAttr = function(attrName, attrVal, callback) {
    log.info('memes findByAttr ' + attrName + ':' + attrVal + '');

    var query = {};
    query[attrName] = attrVal;

    memeModel.find(query, function (err, memes) {
        if (err) {
            log.error(err);
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
                ret = null;
            } else {

                log.info(memes.length + ' entries have been found');
                ret = memes ? memes : [];
            }
            callback(err, ret);
        });
    }
};



var findOneById = function (id, callback) {
    log.info('meme findOneById "' + id + '"');
    var idVal = id;

    if ('string' === typeof id && validatorUtils.isValidId(id)) {
        try {
            idVal = parseInt(id);
        } catch (e) {
            log.error('id cast error');
            callback(e, null);
            return;
        }
    } else {
        errMsg = 'invalid id value/type: ' + id;
        log.error(errMsg);
        callback(errMsg, null);
        return;
    }

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        findByAttr('_id', idVal, callback);
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
    var meme = new memeModel(rqBody);

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        return meme.validate()
            .then(function () {
                log.info('meme data is valid. saving');
                return meme.save();

            }, function (err) {
                errMsg = err;
                log.error(errMsg);
            })
            .then(function (newMeme) {
                log.info('meme has been saved');

                ret = newMeme ? newMeme : null;
            })
            .catch(function (e) {
                errMsg += e;
                ret = null;
                log.error(errMsg);
            })
            .then(function () {
                callback(errMsg, ret);
            })
    }
};


var update = function (idVal, rqBody, callback) {
    log.info('meme model update by id ' + idVal);
    var id = validate(idVal, callback);

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        log.info('finding if meme exists');

        /*
        memeModel
            .findOne({_id: id})
            .exec(function (err, existingMeme) {
                if (err) {
                    log.error(err);
                    callback(err, null);

                } else {
                    if (existingMeme) {
                        log.info('meme has been found. updating');



                    } else {
                        errMsg = 'meme not found';
                        log.error(errMsg);
                        callback({code: 404, msg: errMsg}, null);
                    }
                }
            });*/
        memeModel
            .update({_id: id}, {$set: rqBody})
            .exec()
            .then(function(affected) {
                if (0 !== affected.nModified) {
                    log.info('updated successfully');

                    return memeModel
                        .findOne({_id: id})
                        .exec()
                } else {
                    //throw new DocNotFoundError()
                    ret = null;
                }
            })
            .then(function (updatedMeme) {
                if (updatedMeme) {
                    ret = updatedMeme;
                } else {
                    errMsg = 'meme not found';
                    log.error(errMsg);
                    ret = null;
                }
            })
            .catch(function (err) {
                log.error(err);
                //errMsg = err;
                //log.error(errMsg);
                ret = null;
            })
            .then(function () {
                callback(errMsg, ret);
            })

        /*memeModel
            .update({_id: id}, {$set: rqBody})
            .exec(function (err1, affected) {
                if (err1) {
                    log.error(err1);
                } else {
                    if (0 !== affected.nModified) {
                        log.info('updated successfully');

                        memeModel
                            .findOne({_id: id})
                            .exec(function (err, meme) {
                                if (err) {
                                    log.error(err);
                                } else {
                                    if (meme) {
                                        ret = meme;
                                    } else {
                                        errMsg = 'meme not found';
                                        log.error(errMsg);
                                    }
                                }
                                callback(err, ret);
                            });
                    } else {
                        ret = null;
                    }
                }
                callback(err1, ret);
            })*/
    }
};


//TODO safe delete same as upd but rqBody[is_active] = false;


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.save = save;
exports.update = update;