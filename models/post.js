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




var findAll = function (callback) {
    
};


var findOneById = function (id, callback) {
    
};


var findByTitle = function (title, callback) {
    
};


var save = function (rqBody, callback) {

};


exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByTitle = findByTitle;
exports.save = save;