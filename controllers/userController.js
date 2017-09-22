/**
 * Created by anthony on 09.07.17.
 */
const userModel         = require('../models/user');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const controllerUtils   = require('../utils/controllerUtils');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const integrationCtrl   = require('./integrationController');


var status = 200, ret = null;

function prepareError(err) {
    log.error('user ctrl: ', err.message);

    if (err instanceof ValidationError) {
        status = 400;
    } else if (err instanceof DocNotFoundError) {
        status = 404;
    } else {
        status = 500;
    }

    ret = err;
}


exports.findAll = function (rq, rsp, next) {
    log.info("user ctrl findAll");

    userModel.findAll(function (err, users) {
        if (err) {
            prepareError(err);
        } else {

            if (users) {
                ret = users;
            } else {
                ret = [];
            }
        }
        controllerUtils.respond(rsp, status, ret);
    });
};


exports.findOneById = function (rq, rsp, next) {
    var id = rq.params.id;
    log.info('user ctrl findOneById ' + id);

    userModel.findOneById(id, function (err, singleUser) {
        if (err) {
            prepareError(err);
        } else {

            if (singleUser) {
                ret = singleUser;
                status = 200;
            } else {
                status = 404;
            }
        }

        controllerUtils.respond(rsp, status, ret);
        //callNext(next, rq, ret);
    });
};

exports.findOneByUsername = function (rq, rsp, next) {
    var username = rq.params.username;
    log.info('user ctrl findOneByUsername ' + username);

    userModel.findByUsername(username, function (err, singleUser) {
        if (err) {
            prepareError(err);
        } else {

            if (singleUser) {
                ret = singleUser;
                status = 200;
            } else {
                status = 404;
            }
        }

        controllerUtils.respond(rsp, status, ret);
    })
};

exports.findPostsByUser = function (rq, rsp, next) {
    var id = rq.params.id;
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
        controllerUtils.respond(rsp, status, ret);
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
        controllerUtils.respond(rsp, status, ret);
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
            controllerUtils.respond(rsp, status, e);
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
            controllerUtils.respond(rsp, status, ret);
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
            controllerUtils.respond(rsp, status, e);
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
            controllerUtils.respond(rsp, status, ret);
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
        controllerUtils.respond(rsp, status, ret);
    });
};