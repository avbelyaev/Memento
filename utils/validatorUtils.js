/**
 * Created by anthony on 09.07.17.
 */
var ValidationError     = require('./errors/ValidationError');
var DocNotFoundError    = require('./errors/DocNotFoundError');

function isValidId(id) {
    return /^\d+$/.test(id);
}

function isEmpty(obj) {
    return 0 === Object.keys(obj).length;
}

//TODO remove (moved to modelUtils)
function validateAndConvertId(idVal) {
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
}

function parseJSON(json) {
    if (isEmpty(json)) {
        throw new ValidationError({message: 'empty json'});
    }

    try {
        return JSON.parse(json);

    } catch (e) {
        throw new ValidationError({
            message: 'JSON parse err: ' + e.message
        });
    }
}

exports.isEmpty = isEmpty;
exports.validateAndConvertId = validateAndConvertId;
exports.parseJSON = parseJSON;