/**
 * Created by anthony on 23.09.17.
 */
const log           = require('winston');
const jwt           = require('jwt-simple');
const jwtConfig     = require('../config/jwtConfig');

//TODO move token check into commonMiddleware
exports.checkToken = function (rq, rsp, next) {
    if (!rq.headers['x-auth']) {
        log.warn('request is unauthorized!');
        rsp.sendStatus(401);

    } else {

        var auth;
        try {
            log.info('decoding jwt token');
            auth = jwt.decode(rq.headers['x-auth'], jwtConfig.secretKey);

        } catch (e) {
            log.error('error decoding jwt token');
            return rsp.sendStatus(401);
        }

        log.info('success! proceeding to controller');
        next();
    }
};