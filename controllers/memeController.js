/**
 * Created by anthony on 09.07.17.
 */
const memeModel         = require('../models/meme');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');

//fat model, thin controller

var status = 200, ret = null;

function respond(rsp, status, ret) {
    log.info('rsp(' + status + ')');
    rsp.status(status).send(ret);
}

function prepareError500(err) {
    log.error('meme ctrl: ' + err);

    status = 500;
    ret = err;
}



exports.findAll = function (rq, rsp) {
    log.info("meme ctrl findAll");

    memeModel.findAll(function (err, memes) {
        if (err) {
            prepareError500(err);

        } else {
            if (memes) {
                ret = memes;
            } else {
                ret = [];
            }
        }
        respond(rsp, status, ret);
    });
};




exports.findOneById = function (rq, rsp) {
    var id = rq.params.id;
    log.info('meme ctrl findById ' + id);

    memeModel.findOneById(id, function (err, singleMeme) {
        if (err) {
            prepareError500(err);

        } else {
            if (singleMeme) {
                ret = singleMeme;
            } else {
                status = 404;
            }
        }
        respond(rsp, status, ret);
    });
};



exports.findByTitle = function (rq, rsp) {
    log.info('meme ctrl findByTitle');
    var title = rq.params.title;

    memeModel.findByTitle(title, function (err, memes) {
        if (err) {
            prepareError500(err);

        } else {
            if (memes) {
                ret = memes;
            } else {
                ret = [];
            }
        }
        respond(rsp, status, ret);
    });
};



exports.save = function (rq, rsp) {
    log.info('meme ctrl save');
    var chunks = [];

    var onDataEnd = function () {
        log.info('processing data_end event');

        var rqBody;
        try {
            rqBody = JSON.parse(Buffer.concat(chunks));
        } catch (e) {
            respond(rsp, 400, e);
            return;
        }

        if (validatorUtils.isEmpty(rqBody)) {
            respond(rsp, 400, 'empty body');
        } else {
            //its not in try-catch block since async exceptions
            //cannot be handled in regular try-catch way
            memeModel.save(rqBody, function (err, meme) {
                if (err) {
                    prepareError500(err);
                } else {

                    if (meme) {
                        ret = meme;
                        status = 201;
                    } else {
                        ret = null;
                        status = 404;
                    }
                }
                respond(rsp, status, ret);
            });
        }
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
            rqBody = JSON.parse(Buffer.concat(chunks));
        } catch (e) {
            respond(rsp, 400, e);
            return;
        }

        if (validatorUtils.isEmpty(rqBody)) {
            respond(rsp, 400, 'empty body');
        } else {

            memeModel.update(id, rqBody, function (err, meme) {
                if (err) {
                    if (err.code && 404 === err.code && err.msg) {
                        //doc to be update was not found
                        status = 404;
                        ret = err.msg;

                    } else {
                        //otherwise its regular internal err
                        prepareError500(err);
                    }
                } else {

                    if (meme) {
                        ret = meme;
                    } else {
                        ret = null;
                        status = 404;
                    }
                }
                respond(rsp, status, ret);
            })
        }
    };

    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    rq.on('end', onDataEnd);
};



exports.delete = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};