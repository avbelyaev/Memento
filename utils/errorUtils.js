/**
 * Created by anthony on 30.08.17.
 */
const log               = require('winston');
const InternalError     = require('../utils/errors/InternalError');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');


exports.dbConnError = function(callback) {
    var errMsg = 'DB connection error';
    log.error(errMsg);
    callback(new InternalError({message: errMsg}), null);
};

exports.sendError = function (rsp, err) {
    log.error('sendError: ', err.message);

    var status = 500;
    if (err instanceof ValidationError) {
        status = 400;
    } else if (err instanceof DocNotFoundError) {
        status = 404;
    }

    rsp.status(status).send({
        message: err.message
    });
};