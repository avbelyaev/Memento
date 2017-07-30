/**
 * Created by anthony on 09.07.17.
 */
const postModel         = require('../models/post');
const log               = require('winston');
const validatorUtils    = require('../utils/validatorUtils');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');

//fat model, thin controller

var status = 200, ret = null;

function respond(rsp, status, ret) {
    log.info('--> rsp(' + status + ')');
    rsp.status(status).send(ret);
}

function prepareError(err) {
    log.error('post ctrl: ', err.message);

    status = err.status || 500;
    ret = err;
}



exports.findAll = function (rq, rsp) {
    rsp.status(501).send('NOT IMPLEMENTED');
};


exports.findOneById = function (rq, rsp) {
    var id = rq.query.id;
    log.info('post ctrl findOneById ' + id);

    rsp.status(501).send('NOT IMPLEMENTED');
};


exports.findByTitle = function (rq, rsp) {
    var title = rq.query.title;
    log.info('post ctrl findByTitle "' + title + '"');

    rsp.status(501).send('NOT IMPLEMEdNTED');
};


exports.save = function (rq, rsp) {
    rsp.status(501).send('NOT IMPLEMENTED');
};