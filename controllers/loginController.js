/**
 * Created by anthony on 23.09.17.
 */
const userModel         = require('../models/user');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const sendResponse      = require('../utils/httpUtils').sendResponse;
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const integrationCtrl   = require('./integrationController');
const bcrypt            = require('bcrypt');
const jwt               = require('jwt-simple');
const jwtConfig         = require('../config/jwtConfig');

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

    ret = null;
}

exports.tryLogin = function (rq, rsp, next) {
    log.info('attempting to log in');

    var username = rq.body.username;
    var password = rq.body.password;
    log.info('login/pass: ', username, '/', password);

    if (!username || !password) {
        rsp.sendStatus(400);
    } else {

        userModel.findOneByUsername(username, function (err, userFound) {
            if (err) {
                prepareError(err);
            } else {
                if (userFound) {

                    bcrypt.compare(password, userFound.password, function (err1, valid) {
                        if (err1) {
                            prepareError(err1);
                        } else {

                            if (!valid) {
                                log.error('password is invalid');
                                return rsp.sendStatus(401);
                            } else {

                                var token = jwt.encode({
                                    username: username
                                }, jwtConfig.secretKey);

                                ret = token;
                                status = 200;
                            }
                        }
                        return sendResponse(rsp, status, ret);
                    });
                }
            }
        });
    }
};