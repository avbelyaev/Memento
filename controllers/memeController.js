/**
 * Created by anthony on 09.07.17.
 */
const memeModel         = require('../models/meme');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const sendResponse      = require('../utils/httpUtils').sendResponse;
const callNext          = require('../utils/httpUtils').callNext;
const sendError         = require('../utils/errorUtils').sendError;
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const integrationCtrl   = require('./integrationController');


exports.findAll = function (rq, rsp, next) {
    log.info("meme ctrl findAll");

    memeModel.findAll(function (err, memesAll) {
        if (err) {
            return sendError(rsp, err);

        } else {
            return callNext(next, rq, memesAll, 200);
        }
    });
};




exports.findOneById = function (rq, rsp, next) {
    let id = rq.params.id;
    log.info('meme ctrl findOneById ' + id);

    memeModel.findOneById(id, function (err, singleMeme) {
        if (err) {
            return sendError(rsp, err);

        } else {
            if (singleMeme) {
                return callNext(next, rq, singleMeme, 200);

            } else {
                return sendResponse(rsp, 404);
            }
        }
    });
};



exports.findPostsByMeme = function (rq, rsp, next) {
    let id = rq.params.id;
    log.info('meme ctrl findPostsByMeme with id ', id);

    integrationCtrl.findPostsByMemeId(id, function (err, memes) {
        if (err) {
            return sendError(rsp, err);

        } else {
            let ret = null;

            if (memes) {
                ret = memes;
            } else {
                ret = [];
            }
            return callNext(next, rq, ret, 200);
        }
    })
};


exports.save = function (rq, rsp) {
    log.info('meme ctrl save');
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

        memeModel.save(rqBody, function (err, meme) {
            if (err) {
                prepareError(err);
            } else {

                if (meme) {
                    ret = meme;
                    status = 201;
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
    log.info('meme ctrl update by id ' + id);
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

        memeModel.update(id, rqBody, function (err, meme) {
            if (err) {
                prepareError(err);
            } else {

                if (meme) {
                    ret = meme;
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
    log.info('meme ctrl delete by id ' + id);

    memeModel.delete(id, function (err, deletedMeme) {
        if (err) {
            prepareError(err);
        } else {

            if (deletedMeme) {
                ret = deletedMeme;
            } else {
                status = 404;
            }
        }
        return sendResponse(rsp, status, ret);
    });
};