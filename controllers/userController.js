/**
 * Created by anthony on 09.07.17.
 */
const userModel         = require('../models/user');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const sendResponse      = require('../utils/httpUtils').sendResponse;
const callNext          = require('../utils/httpUtils').callNext;
const sendError         = require('../utils/errorUtils').sendError;
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const integrationCtrl   = require('./integrationController');


exports.findAll = function (rq, rsp, next) {
    log.info("user ctrl findAll");

    userModel.findAll(function (err, usersAll) {
        if (err) {
            return sendError(rsp, err);

        } else {
            return callNext(next, rq, usersAll, 200);
        }
    });
};


exports.findOneById = function (rq, rsp, next) {
    let id = rq.params.id;
    log.info('user ctrl findOneById ' + id);

    userModel.findOneById(id, function (err, singleUser) {
        if (err) {
            return sendError(rsp, err);

        } else {
            if (singleUser && 1 === singleUser.length) {
                return callNext(next, rq, singleUser[0], 200);

            } else {
                return sendResponse(rsp, 404);
            }
        }
    });
};

exports.search = function (rq, rsp, next) {
    let username = rq.query.username;
    let firstName = rq.query.firstname;

    let searchParams = {};
    if (username || firstName) {

        if (username) {
            searchParams.username = username;
        }
        if (firstName) {
            searchParams.firstName = firstName;
        }

    } else {
        return rsp.status(400).send({
            message: "no supported search parameters found"
        });
    }

    userModel.search(searchParams, function (err, usersFound) {
        if (err) {
            return sendError(rsp, err);

        } else {
            return callNext(next, rq, usersFound, 200);
        }
    })
};

exports.findPostsByUser = function (rq, rsp, next) {
    let id = rq.params.id;
    log.info('user ctrl findPostsByUser with id' + id);

    integrationCtrl.findPostsByUser(id, function (err, postsByUser) {
        if (err) {
            prepareError(err);
        } else {

            if (postsByUser) {
                ret = postsByUser;
            } else {
                ret = [];
            }
        }
        controllerUtils.sendResponse(rsp, status, ret);
    });
};


exports.findMemesByUser = function (rq, rsp, next) {
    var id = rq.params.id;
    log.info('user ctrl findMemesByUser with id' + id);

    integrationCtrl.findMemesByUser(id, function (err, users) {
        if (err) {
            prepareError(err);
        } else {

            if (users) {
                ret = users;
            } else {
                ret = [];
            }
        }
        controllerUtils.sendResponse(rsp, status, ret);
    });
};


exports.save = function (rq, rsp, next) {
    log.info('user ctrl save');
    var chunks = [];

    var onDataEnd = function () {
        log.info('processing data_end event');

        var rqBody;
        try {
            rqBody = validatorUtils.parseJSON(Buffer.concat(chunks));

        } catch (e) {
            prepareError(e);
            controllerUtils.sendResponse(rsp, status, e);
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
            controllerUtils.sendResponse(rsp, status, ret);
        });
    };


    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    rq.on('end', onDataEnd);
};


exports.update = function (rq, rsp, next) {
    const id = rq.params.id;
    log.info('user ctrl update by id ' + id);
    var chunks = [];

    var onDataEnd = function () {
        log.info('processing data_end event');

        var rqBody;
        try {
            rqBody = validatorUtils.parseJSON(Buffer.concat(chunks));

        } catch (e) {
            prepareError(e);
            controllerUtils.sendResponse(rsp, status, e);
            return;
        }

        userModel.update(id, rqBody, function (err, user) {
            if (err) {
                prepareError(err);
            } else {

                if (user) {
                    ret = user;
                } else {
                    ret = null;
                    status = 404;
                }
            }
            controllerUtils.sendResponse(rsp, status, ret);
        })
    };

    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    rq.on('end', onDataEnd);
};


exports.delete = function (rq, rsp, next) {
    var id = rq.params.id;
    log.info('user ctrl delete by id ' + id);

    userModel.delete(id, function (err, deletedUser) {
        if (err) {
            prepareError(err);
        } else {

            if (deletedUser) {
                ret = deletedUser;
            } else {
                status = 404;
            }
        }
        controllerUtils.sendResponse(rsp, status, ret);
    });
};