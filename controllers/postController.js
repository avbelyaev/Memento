/**
 * Created by anthony on 09.07.17.
 */
const postModel         = require('../models/post');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const sendResponse      = require('../utils/httpUtils').sendResponse;
const callNext          = require('../utils/httpUtils').callNext;
const sendError         = require('../utils/errorUtils').sendError;
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');


//fat model, thin controller

exports.findAll = function (rq, rsp, next) {
    log.info("post ctrl findAll");

    postModel.findAll(function (err, postsAll) {
        if (err) {
            return sendError(rsp, err);

        } else {
            return callNext(next, rq, postsAll, 200);
        }
    });
};


exports.findOneById = function (rq, rsp, next) {
    let id = rq.params.id;
    log.info('post ctrl findOneById ', id);

    postModel.findOneById(id, function (err, singlePost) {
        if (err) {
            return sendError(rsp, err);

        } else {
            if (singlePost) {
                return callNext(next, rq, singlePost, 200);

            } else {
                return sendResponse(rsp, 404);
            }
        }
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
            return sendResponse(rsp, status, e);
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
            return sendResponse(rsp, status, ret);
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
            return sendResponse(rsp, status, e);
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
            return sendResponse(rsp, status, ret);
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
        return sendResponse(rsp, status, ret);
    });
};