/**
 * Created by anthony on 09.07.17.
 */
const userModel         = require('../models/user');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const controllerUtils   = require('../utils/controllerUtils');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');


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


exports.findAll = function (rq, rsp, next) {
    rsp.send('NOT IMPLEMENTED');
};

exports.save = function (rq, rsp, next) {
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

        userModel.save(rqBody, function (err, meme) {
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