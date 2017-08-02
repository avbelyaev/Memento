/**
 * Created by anthony on 09.07.17.
 */
const postModel         = require('../models/post');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const controllerUtils   = require('../utils/controllerUtils');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');

//fat model, thin controller

var status = 200, ret = null;

function prepareError(err) {
    log.error('meme ctrl: ', err.message);

    if (err instanceof ValidationError) {
        status = 400;
    } else if (err instanceof DocNotFoundError) {
        status = 404;
    } else {
        status = 500;
    }

    ret = err;
}



exports.findAll = function (rq, rsp) {
    log.info("post ctrl findAll");

    postModel.findAll(function (err, memes) {
        if (err) {
            prepareError(err);
        } else {

            if (memes) {
                ret = memes;
            } else {
                ret = [];
            }
        }
        controllerUtils.respond(rsp, status, ret);
    });
};


exports.findOneById = function (rq, rsp) {
    var id = rq.query.id;
    log.info('post ctrl findOneById ' + id);

    postModel.findOneById(id, function (err, singlePost) {
        if (err) {
            prepareError(err);
        } else {

            if (singlePost) {
                ret = singlePost;
            } else {
                status = 404;
            }
        }
        controllerUtils.respond(rsp, status, ret);
    });
};


exports.findByTitle = function (rq, rsp) {
    var title = rq.query.title;
    log.info('post ctrl findByTitle "' + title + '"');

    rsp.status(501).send('NOT IMPLEMENTED');
};


exports.save = function (rq, rsp) {
    rsp.status(501).send('NOT IMPLEMENTED');
};