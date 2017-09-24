/**
 * Created by anthony on 30.07.17.
 */
var AppError = require('./AppError');

module.exports = class ValidationError extends AppError {

    constructor(payload) {
        let msg = 'Validation error';
        let data = {};

        if (payload) {
            if ('string' === typeof payload) {
                msg = payload;

            } else {
                data = payload;
            }
        }
        super(msg, 400, data);
    }
};