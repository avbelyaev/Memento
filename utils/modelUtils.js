/**
 * Created by anthony on 24.09.17.
 */
const InternalError     = require('./errors/InternalError');
const DocNotFoundError  = require('./errors/DocNotFoundError');
const log               = require('winston');


exports.findByAttr = function(model, searchParams, callback) {
    log.info('findByAttr');

    model.find(searchParams, function (err, entriesByAttr) {
        let ret = null;
        if (err) {
            err = new InternalError(err);

        } else {
            log.info('entries found by attr: ', entriesByAttr.length);

            ret = entriesByAttr ? entriesByAttr : [];
        }
        callback(err, ret);
    });
};

function isValidId(id) {
    return /^\d+$/.test(id);
}

exports.validateAndConvertId = function(idVal) {
    if ('string' === typeof idVal && isValidId(idVal)) {

        try {
            return parseInt(idVal);

        } catch (e) {
            throw new DocNotFoundError({
                message: 'Id cast error: ' + e.message
            });
        }

    } else {
        throw new DocNotFoundError({
            message: 'Invalid id value/type: ' + idVal
        });
    }
};