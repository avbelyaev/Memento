/**
 * Created by anthony on 02.08.17
 */
const log = require('winston');

exports.respond = function(rsp, status, ret) {
    log.info('--> rsp(' + status + ')');
    rsp.status(status).send(ret);
};