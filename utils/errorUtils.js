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

exports.sendError = function (rsp, errRaw) {
    let msg = errRaw.message;
    log.error('sendError: ', msg);

    let error = {};
    error.message = msg;

    let status = 500;
    //determine if error already wrapped in my custom error
    let isWrappedError = false;
    if (errRaw instanceof ValidationError) {
        status = 400;
        isWrappedError = true;

    } else if (errRaw instanceof DocNotFoundError) {
        status = 404;
        isWrappedError = true;

    } else if (errRaw instanceof InternalError) {
        status = 500;
        isWrappedError = true;
    }

    if (isWrappedError) {
        if (errRaw.data && errRaw.data.message) {
            error.message = errRaw.data.message

        } else {
            error.message = errRaw.message;
        }
    }

    rsp.status(status).send(error);
};