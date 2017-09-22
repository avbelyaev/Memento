/**
 * Created by anthony on 23.09.17.
 */
const userModel         = require('../models/user');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const controllerUtils   = require('../utils/controllerUtils');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const integrationCtrl   = require('./integrationController');
const bcrypt            = require('bcrypt');
const jwt               = require('jwt-simple');

var status = 200, ret = null;

function prepareError(err) {
    log.error('login ctrl: ', err.message);

    if (err instanceof ValidationError) {
        status = 400;
    } else if (err instanceof DocNotFoundError) {
        status = 404;
    } else {
        status = 500;
    }

    ret = err;
}

exports.tryLogin = function (rq, rsp, next) {
    log.info('attempting to log in');

    var username = rq.body.username;
    var password = rq.body.password;
    log.info('login/pass: ', username, '/', password);

    if (!username || !password) {
        rsp.sendStatus(400);
    } else {

        userModel.findByUsername(username, function (err, userFound) {
            if (err) {
                prepareError(err);
            } else {
                ret = userFound;
                log.info(userFound);
            }
            controllerUtils.respond(rsp, status, ret);
        });
    }
};