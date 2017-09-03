/**
 * Created by anthony on 09.07.17.
 */
const memeModel         = require('../models/meme');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const controllerUtils   = require('../utils/controllerUtils');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const integrationCtrl   = require('./integrationController');

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
    log.info("meme ctrl findAll");

    memeModel.findAll(function (err, memes) {
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
    var id = rq.params.id;
    log.info('meme ctrl findById ' + id);

    memeModel.findOneById(id, function (err, singleMeme) {
        if (err) {
            prepareError(err);
        } else {

            if (singleMeme) {
                ret = singleMeme;
            } else {
                status = 404;
            }
        }
        controllerUtils.respond(rsp, status, ret);
    });
};



exports.findByTitle = function (rq, rsp) {
    log.info('meme ctrl findByTitle');
    var title = rq.params.title;

    memeModel.findByTitle(title, function (err, memes) {
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


exports.findPostsByMeme = function (rq, rsp, next) {
    var id = rq.params.id;
    log.info('meme ctrl findPostsByMeme with id ' + id);

    integrationCtrl.findPostsByMemeId(id, function (err, memes) {
        //TODO move to function
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
            controllerUtils.respond(rsp, status, e);
            return;
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
    log.info('meme ctrl update by id ' + id);
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
        controllerUtils.respond(rsp, status, ret);
    });
};