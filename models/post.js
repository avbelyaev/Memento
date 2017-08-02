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


const postSchema = Schema({
    _id: Number,
    title: { type: String, required: true },
    meme_id: { type: Number, ref: 'meme' },
    user_id: { type: Number, ref: 'user' },
    text: { type: Number },
    create_datetime: { type: Date, default: Date.now() },
    rating: { type: Number, default: 0 },
    tags: [{ tag: String }]
});

postSchema.pre('save', function (next) {
    log.info('post_id inc');
    var docBeingSaved = this;


    counter.findByIdAndUpdate(
        {_id: 'post_id'},
        {$inc: {seq: 1}},
        function (err, counter) {
            if (err)
                return next(err);
            docBeingSaved._id = counter.seq;
            log.info('id: ' + docBeingSaved._id);

            next();
        });
});

const postModel = mongoose.model('post', postSchema);



var ret = null;

function dbConnError(callback) {
    var errMsg = 'DB connection error';
    log.error(errMsg);
    callback(new InternalError({message: errMsg}), null);
}

var findByAttr = function(attrName, attrVal, callback) {
    log.info('posts findByAttr [' + attrName + ':' + attrVal + ']');

    var query = {};
    query[attrName] = attrVal;

    postModel.find(query, function (err, posts) {
        if (err) {
            err = new InternalError(err);
            ret = null;

        } else {
            ret = posts ? posts : [];
        }
        callback(err, ret);
    });
};




var findAll = function (callback) {
    log.info('posts findAll');

    if (!db.isConnected()) {
        dbConnError(callback);
    } else {

        postModel.find({}, function (err, posts) {
            if (err) {
                err = new InternalError(err);
            } else {

                log.info('entries found: ' + posts.length);
                ret = posts ? posts : [];
            }
            callback(err, ret);
        });
    }
};


var findOneById = function (idVal, callback) {
    log.info('post findOneById [' + idVal + ']');

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

        return findByAttr('_id', id, function (err, postsFound) {
            var error = ret = null;

            if (err) {
                error = new InternalError(err);

            } else {
                if (postsFound && 1 === postsFound.length) {
                    ret = postsFound;

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


var findByTitle = function (title, callback) {
    
};


var save = function (rqBody, callback) {

};


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.save = save;