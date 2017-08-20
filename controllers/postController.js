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

//TODO move this into middleware executed after any response
//to set statuses globally
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

function callNext(next, rq, ret) {
    rq.locals = {};
    rq.locals.ret = ret;
    rq.locals.status = status;

    next();
}




exports.findAll = function (rq, rsp, next) {
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

        callNext(next, rq, ret);
    });
};


exports.findOneById = function (rq, rsp, next) {
    var id = rq.params.id;
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

        callNext(next, rq, ret);
    });
};

exports.findOneByIdGetMeme = function (rq, rsp) {
    rsp.status(501).send('NOT IMPLEMENTED');
};


exports.findByTitle = function (rq, rsp) {
    var title = rq.query.title;
    log.info('post ctrl findByTitle "' + title + '"');


    postModel.findByTitle(title, function (err, posts) {
        if (err) {
            prepareError(err);
        } else {

            if (posts) {
                ret = posts;
            } else {
                ret = [];
            }
        }
        controllerUtils.respond(rsp, status, ret);
    });
};


exports.save = function (rq, rsp) {
    log.info('post ctrl save');
    var chunks = [];

    var onDataEnd = function () {
        log.info('processing data_end event');

        var rqBody;
        try {
            rqBody = validatorUtils.parseJSON(Buffer.concat(chunks));

        } catch (e) {
            prepareError(e);
            controllerUtils.respond(rsp, status, e);
            return;
        }

        postModel.save(rqBody, function (err, post) {
            if (err) {
                prepareError(err);
            } else {

                if (post) {
                    ret = post;
                } else {
                    ret = null;
                    status = 404;
                }
            }
            controllerUtils.respond(rsp, status, ret);
        });
    };


    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    rq.on('end', onDataEnd);
};



exports.update = function (rq, rsp) {
    const id = rq.params.id;
    log.info('post ctrl update by id ' + id);
    var chunks = [];

    var onDataEnd = function () {
        log.info('processing data_end event');

        var rqBody;
        try {
            rqBody = validatorUtils.parseJSON(Buffer.concat(chunks));

        } catch (e) {
            prepareError(e);
            controllerUtils.respond(rsp, status, e);
            return;
        }

        postModel.update(id, rqBody, function (err, post) {
            if (err) {
                prepareError(err);
            } else {

                if (post) {
                    ret = post;
                } else {
                    ret = null;
                    status = 404;
                }
            }
            controllerUtils.respond(rsp, status, ret);
        })
    };

    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    rq.on('end', onDataEnd);
};


exports.delete = function (rq, rsp) {
    var id = rq.params.id;
    log.info('post ctrl delete by id ' + id);

    postModel.delete(id, function (err, deletedPost) {
        if (err) {
            prepareError(err);
        } else {

            if (deletedPost) {
                ret = deletedPost;
            } else {
                status = 404;
            }
        }
        controllerUtils.respond(rsp, status, ret);
    });
};