/**
 * Created by anthony on 03.09.17.
 */

const log               = require('winston');
const memeController    = require('./memeController');
const postController    = require('./postController');
const userController    = require('./userController');
const postModel         = require('../models/post');
const memeModel         = require('../models/meme');
const userModel         = require('../models/user');

/*
this controller was made to serve integrations like
accessing model from another external controller
in order to reduce complexity of concrete controllers
e.g. accessing memeModel (via memeController?) from userController
 */

var findPostsByMemeId = function (memeId, callback) {
    log.info('integr ctrl findPostsByMeme with id ' + memeId);

    postModel.findByMemeId(memeId, callback);
};


var findPostsByUser = function (userId, callback) {
    log.info('integr ctrl findPostsByUser with id ' + userId);

    postModel.findByUserId(userId, callback);
};


var findMemesByUser = function (userId, callback) {
    log.info('integr ctrl findMemesByUser with id ' + userId);

    //first find posts by user
    postModel.findByUserId(userId, function (err, postsByUser) {
        if (err) {
            throw err; //TODO throw or handle and returnInternal err?
        } else {
            if (postsByUser) {
                //posts found. find memes by posts
                //TODO there has to be a better way to accomplish this

                var memesFromPosts = [];
                for (p in postsByUser) {

                    postModel.getMemeByPost(p, callback);
                }
                //then...
                //TODO how to do it async since list is empty after loop


            } else {
                callback(err, []);
            }
        }
    })
};

exports.findPostsByMemeId = findPostsByMemeId;
exports.findPostsByUser = findPostsByUser;