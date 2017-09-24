/**
 * Created by anthony on 30.07.17.
 */
const AppError = require('./AppError');

module.exports = class DocNotFoundError extends AppError {

    constructor(payload) {
        let msg = 'Document not found error';
        let data = {};

        if (payload) {
            if ('string' === typeof payload) {
                msg = payload;

            } else {
                data = payload;
            }
        }
        super(msg, 404, data);
    }
};