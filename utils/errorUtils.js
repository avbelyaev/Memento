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
    callback(new InternalError(errMsg), null);
};

exports.sendError = function (rsp, err) {
    let msg = err.message;
    log.error('sendError: ', msg);

    let error = {};
    error.message = err.message;

    let status = 500;
    //determine if error already wrapped in my custom error
    let isWrappedError = false;
    if (err instanceof ValidationError) {
        status = 400;
        isWrappedError = true;

    } else if (err instanceof DocNotFoundError) {
        status = 404;
        isWrappedError = true;

    } else if (err instanceof InternalError) {
        isWrappedError = true;
    }

    if (isWrappedError && err.data) {
        error = err.data || err.message;
    }

    rsp.status(status).send(error);
};