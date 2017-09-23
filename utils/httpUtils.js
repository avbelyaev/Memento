/**
 * Created by anthony on 23.09.17.
 */
const log = require('winston');

exports.callNext = function(next, rq, ret, status, headers) {
    log.info('calling next...');

    rq.locals = {};
    if (headers) {
        rq.locals.headers = headers;
    }
    rq.locals.ret = ret;
    rq.locals.status = status;

    next();
};

exports.sendResponse = function(rsp, status, ret, headers) {
    log.info('--> Rsp: ', status);

    if (rsp && status && (!ret && !headers)) {
        rsp.sendStatus(status);
    }

    if (headers) {
        rsp.set(headers);
    }

    rsp.status(status).send(ret);
};

