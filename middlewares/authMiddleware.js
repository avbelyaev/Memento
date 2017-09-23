/**
 * Created by anthony on 23.09.17.
 */
const log           = require('winston');
const jwt           = require('jwt-simple');
const jwtConfig     = require('../config/jwtConfig');


exports.checkToken = function (rq, rsp, next) {
    if (!rq.headers['authorization']) {
        log.warn('request is unauthorized!');
        return rsp.sendStatus(401);
    }

    let auth;
    try {
        log.info('decoding jwt token');
        auth = jwt.decode(rq.headers['authorization'], jwtConfig.secretKey);

    } catch (e) {
        log.error('token was not decoded!');
        return rsp.sendStatus(401);
    }

    log.info('success! proceeding to controller');
    next();
};