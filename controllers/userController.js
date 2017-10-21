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


//TODO remove any logic from controller and impl it in model or resource
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
            if (singleUser) {
                return callNext(next, rq, singleUser, 200);

            } else {
                return sendResponse(rsp, 404);
            }
        }
    });
};

exports.search = function (rq, rsp, next) {
    log.info('user ctrl search');
    let searchParams = rq.query;

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
    log.info('user ctrl findPostsByUser with id', id);

    integrationCtrl.findPostsByUser(id, function (err, postsByUser) {
        if (err) {
            return sendError(rsp, err);

        } else {
            let ret = null;

            if (postsByUser) {
                ret = postsByUser;
            } else {
                ret = [];
            }
            return callNext(next, rq, ret, 200);
        }
    });
};


exports.findMemesByUser = function (rq, rsp, next) {
    let id = rq.params.id;
    log.info('user ctrl findMemesByUser with id ', id);

    integrationCtrl.findMemesByUser(id, function (err, users) {
        if (err) {
            return sendError(rsp, err);

        } else {
            let ret = null;

            if (users) {
                ret = users;

            } else {
                ret = [];
            }
            return callNext(next, rq, ret, 200);
        }
    });
};


exports.save = function (rq, rsp, next) {
    log.info('user ctrl save');
    let chunks = [];

    let onDataEnd = function () {
        log.info('processing data_end event');

        let rqBody;
        try {
            rqBody = validatorUtils.parseJSON(Buffer.concat(chunks));

        } catch (e) {
            return sendError(rsp, e);
        }

        userModel.save(rqBody, function (err, meme) {
            if (err) {
                return sendError(rsp, err);

            } else {
                let status = null, ret = null;
                if (meme) {
                    ret = meme;
                    status = 201;

                } else {
                    status = 404;
                }
                return sendResponse(rsp, status, ret);
            }
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