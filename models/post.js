/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const validatorUtils    = require('../utils/validatorUtils');
const errorUtils        = require('../utils/errorUtils');
const db                = require('../db');
const counter           = require('./counter');
const log               = require('winston');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const InternalError     = require('../utils/errors/InternalError');


const postSchema = Schema({
    _id: Number,
    is_active: { type: Boolean, default: true},
    title: { type: String, required: true },
    meme_id: { type: Number, ref: 'meme', required: true },
    user_id: { type: Number, ref: 'user', required: true },
    text: {
        top_text: String,
        mid_text: String,
        bot_text: String
    },
    create_datetime: { type: Date, default: Date.now() },
    rating: { type: Number, default: 0 },
    tags: [{ tag: String }],
    visible: { type: Boolean, default: true}
}/*, {
    strict: 'throw' //fails on unknown fields in rqBody
}*/);

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






var findByAttr = function(attrName, attrVal, callback) {
    log.info('posts findByAttr [' + attrName + ':' + attrVal + ']');

    var query = {}, ret = null;
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
    var ret = null;

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
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


var findByTitle = function(title, callback) {
    log.info('post findByTitle "' + title + '"');

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
    } else {

        findByAttr('title', title, callback);
    }
};

var findPostByMemeId = function (memeIdVal, callback) {
    log.info('post findByMemeId "' + memeIdVal + '"');

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
        return;
    }

    var id;
    try {
        id = validatorUtils.validateAndConvertId(idVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    findByAttr('meme_id', id, callback);
};

var findPostByUserId = function (userIdVal, callback) {
    log.info('post findByMemeId "' + userIdVal + '"');

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
        return;
    }

    var id;
    try {
        id = validatorUtils.validateAndConvertId(userIdVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    findByAttr('user_id', id, callback);
};


//TODO by post or postId or just unwind post?
var getMemeId = function (postIdVal, callback) {
    log.info("post");
};


var save = function (rqBody, callback) {
    log.info('post model save');

    var ret = null;
    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
    } else {

        var post;
        try {
            post = new postModel(rqBody);
        } catch(e) {
            log.error(e.message);
            callback(new ValidationError(e), null);
            return;
        }

        ret = null;

        return post
            .validate()
            .then(function () {

                log.info('post data is valid. saving');
                return post.save();

            }, function (err) {
                throw new ValidationError(err);
            })
            .then(function (newPost) {

                if (newPost) {
                    log.info('post has been saved');
                    ret = newPost;

                } else {
                    throw new DocNotFoundError({message: 'new post not found'});
                }
            })
            .then(function () {
                callback(null, ret);
            })
            .catch(function (e) {
                log.error('post model save err: ', e.message);

                callback(e, null);
            })

    }
};


var update = function (idVal, rqBody, callback) {
    log.info('post model update by id [' + idVal + ']');

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
            var tmp = new postModel(rqBody);
        } catch(e) {
            log.error(e.message);
            callback(new ValidationError(e), null);
            return;
        }

        ret = null;

        return postModel
            .update({_id: id}, {$set: rqBody})
            .exec()
            .then(function(affected) {
                log.info('entries affected: ', affected);

                if (0 !== affected.n) {
                    //if any was affected then find what was it
                    return postModel
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
            .then(function (updatedPost) {

                if (updatedPost) {
                    log.info('updated post found');
                    ret = updatedPost;

                } else {
                    throw new DocNotFoundError({message: 'updated post not found'});
                }
            })
            .then(function () {
                callback(null, ret);
            })
            .catch(function (e) {
                log.error('post model update err: ', e.message);

                callback(e, null);
            })

    }
};


var postDelete = function (idVal, callback) {
    log.info('post model delete by id [' + idVal + ']');

    var inactivePost = {};
    inactivePost['is_active'] = false;

    log.info('try safe delete by setting is_active=false');
    update(idVal, inactivePost, callback);
};


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.findByMemeId = findPostByMemeId;
exports.findByUserId = findPostByUserId;
exports.save = save;
exports.update = update;
exports.delete = postDelete;
exports.getMemeIdByost