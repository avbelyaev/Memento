const AppError = require('./AppError');

module.exports = class InternalError extends AppError {

    constructor(payload) {
        let msg = 'Internal app error';
        let data = {};

        if (payload) {
            if ('string' === typeof payload) {
                msg = payload;

            } else {
                data = payload;
            }
        }
        super(msg, 500, data);
    }
};