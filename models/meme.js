/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const validatorUtils    = require('../utils/validatorUtils');
const errorUtils        = require('../utils/errorUtils');
const modelUtils        = require('../utils/modelUtils');
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
    let docBeingSaved = this;


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






const findAll = function (callback) {
    log.info('memes findAll');

    if (!db.isConnected()) {
        return errorUtils.dbConnError(callback);
    }

    memeModel.find({}, function (err, memes) {
        if (err) {
            return callback(err, memes);

        } else {
            log.info('entries found: ', memes.length);
            return callback(null , memes);
        }
    });
};



const findOneById = function (idVal, callback) {
    log.info('meme findOneById ', idVal);

    let id;
    try {
        id = validatorUtils.validateAndConvertId(idVal);

    } catch(e) {
        log.error('validate/convert err: ', e.message);
        return callback(e, null);
    }

    if (!db.isConnected()) {
        return errorUtils.dbConnError(callback);
    }

    let queryId = { _id: id };
    return modelUtils.findByAttr(memeModel, queryId, function (err, singleMeme) {
        if (err) {
            return callback(err, null);

        } else {
            let error = null, ret = null;

            if (singleMeme && 1 === singleMeme.length) {
                ret = singleMeme[0];

            } else {
                error = new DocNotFoundError({
                    message: 'meme not found or found more than one'
                });
            }
            return callback(error, ret);
        }
    });
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
    var ret = null;

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
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

    var id, ret = null;
    try {
        id = validatorUtils.validateAndConvertId(idVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);

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


const memeModel = mongoose.model('meme', memeSchema);

exports.findAll = findAll;
exports.findOneById = findOneById;
exports.save = save;
exports.update = update;
exports.delete = memeDelete;