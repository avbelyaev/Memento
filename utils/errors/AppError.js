/**
 * Created by anthony on 30.07.17.
 */
module.exports = class AppError extends Error {

    constructor(msg, status, data) {
        super(msg);

        this.name = this.constructor.name;
        this.status = status || 500;
        this.data = data || {};
    }
};