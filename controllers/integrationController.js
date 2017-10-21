/**
 * Created by anthony on 03.09.17.
 */
const log               = require('winston');
const memeController    = require('./memeController');
const postController    = require('./postController');
const userController    = require('./userController');
const sendError         = require('../utils/errorUtils').sendError;
const Post              = require('../models/post');
const Meme              = require('../models/meme');
const User              = require('../models/user');

/*
this controller was made to serve integrations like
accessing model from another external controller
in order to reduce complexity of concrete controllers
e.g. accessing Meme (via memeController?) from userController
 */

const findPostsByMemeId = function (memeId, callback) {
    log.info('integr ctrl findPostsByMeme with id ', memeId);

    Post.findByMemeId(memeId, callback);
};


const findPostsByUser = function (userId, callback) {
    log.info('integr ctrl findPostsByUser with id ', userId);

    Post.findPostsByUserId(userId, callback);
};


const findMemesByUser = function (userId, callback) {
    log.info('integr ctrl findMemesByUser with id ', userId);

    //first find posts by user
    Post.findPostsByUserId(userId, function (err, postsByUser) {
        if (err) {
            return callback(err, null);

        } else {
            if (postsByUser) {

                let idsOfMemesOfPostsByUser = new Set();
                for (let p in postsByUser) {
                    if (postsByUser.hasOwnProperty(p)) {

                        let post = postsByUser[p];
                        let memeId = Post.getMemeId(post._doc);
                        idsOfMemesOfPostsByUser.add(memeId);
                    }
                }

                Meme.findMemesWithIds(Array.from(idsOfMemesOfPostsByUser), callback);

            } else {
                callback(err, []);
            }
        }
    })
};

exports.findPostsByMemeId = findPostsByMemeId;
exports.findPostsByUser = findPostsByUser;
exports.findMemesByUser = findMemesByUser;
