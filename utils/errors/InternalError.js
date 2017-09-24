const AppError = require('./AppError');

module.exports = class InternalError extends AppError {

    constructor(data) {
        super('Application internal error', 500, data || {});
    }
};