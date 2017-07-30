/**
 * Created by anthony on 30.07.17.
 */
var AppError = require('./AppError');

module.exports = class ValidationError extends AppError {

    constructor(data) {
        super('Validation error', 400, data || {});
    }
};