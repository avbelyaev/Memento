/**
 * Created by anthony on 24.09.17.
 */
const InternalError     = require('./errors/InternalError');
const log               = require('winston');


exports.findByAttr = function(model, searchParams, callback) {
    log.info('findByAttr');

    model.find(searchParams, function (err, entitiesByAttr) {
        let ret = null;
        if (err) {
            err = new InternalError(err);

        } else {
            log.info('found by attr: ', entitiesByAttr.length);

            ret = entitiesByAttr ? entitiesByAttr : [];
        }
        callback(err, ret);
    });
};