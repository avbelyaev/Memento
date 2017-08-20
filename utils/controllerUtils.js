/**
 * Created by anthony on 02.08.17
 */
const log = require('winston');

exports.respond = function(rsp, status, ret, headers) {
    log.info('--> rsp(' + status + ')');

    if (headers) {
        rsp.set(headers);
    }

    rsp.status(status).send(ret);
};