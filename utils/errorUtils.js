/**
 * Created by anthony on 30.08.17.
 */
const log               = require('winston');
const InternalError     =


exports.dbConnError = function(callback) {
    var errMsg = 'DB connection error';
    log.error(errMsg);
    callback(new InternalError({message: errMsg}), null);
};