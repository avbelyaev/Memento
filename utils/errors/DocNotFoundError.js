/**
 * Created by anthony on 30.07.17.
 */
var AppError = require('./AppError');

module.exports = class DocNotFoundError extends AppError {

    constructor(data) {
        super('Document not found', 404, data || {});
    }
};