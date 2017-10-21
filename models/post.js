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


const ID = '_id';

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






const findAll = function (callback) {
    log.info('posts findAll');

    if (!db.isConnected()) {
        return errorUtils.dbConnError(callback);
    }

    postModel.find({}, function (err, posts) {
        if (err) {
            return callback(err, null);

        } else {
            log.info('entries found: ' + posts.length);
            return callback(null, posts);
        }
    });
};


const findOneById = function (idVal, callback) {
    log.info('post findOneById ', idVal);

    let id;
    try {
        id = validatorUtils.validateAndConvertId(idVal);

    } catch(e) {
        log.error('validation/convert err: ', e.message);
        return callback(e, null);
    }

    if (!db.isConnected()) {
        return errorUtils.dbConnError(callback);
    }

    let queryId = { _id: id };
    modelUtils.findByAttr(postModel, queryId, function (err, singlePost) {
        if (err) {
            return callback(err, null);

        } else {
            let error = null, ret = null;

            if (singlePost && 1 === singlePost.length) {
                ret = singlePost[0];

            } else {
                error = new DocNotFoundError('post not found or found more than one');
            }
            return callback(error, ret);
        }
    });
};


const findPostByMemeId = function (memeIdVal, callback) {
    log.info('post findByMemeId "', memeIdVal, '"');

    if (!db.isConnected()) {
        return errorUtils.dbConnError(callback);
    }

    let id;
    try {
        id = validatorUtils.validateAndConvertId(memeIdVal);

    } catch(e) {
        log.error('validate/convert id err: ', e.message);
        return callback(e, null);
    }

    let memeIdQuery = {
        meme_id: id
    };
    modelUtils.findByAttr(postModel, memeIdQuery, callback);
};

const findPostsByUserId = function (userIdVal, callback) {
    log.info('post findPostsByUserId "', userIdVal, '"');

    if (!db.isConnected()) {
        return errorUtils.dbConnError(callback);
    }

    let id;
    try {
        id = validatorUtils.validateAndConvertId(userIdVal);

    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        return callback(e, null);
    }

    let searchParams = {
        user_id: userIdVal
    };
    modelUtils.findByAttr(postModel, searchParams, callback);
};


// get all ids of user's posts. aggregate ids. filter unique
// get memes where _id in [ids]. with one request only O(c),
// not with one request for each _id O(n)    (c)Arthur@mail.ru
const getMemeId = function (post) {
    log.info("getMemeId(post)");

    if (post.hasOwnProperty('meme_id')) {
        return post['meme_id']

    } else {
        log.error('post[', post._id, 'has no meme_id');
    }
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


const postModel = mongoose.model('post', postSchema);

exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByMemeId = findPostByMemeId;
exports.findPostsByUserId = findPostsByUserId;
exports.save = save;
exports.update = update;
exports.delete = postDelete;
exports.getMemeId = getMemeId;
