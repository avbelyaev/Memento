/**
 * Created by anthony on 09.07.17.
 */

exports.isValidId = function (id) {
    return /^\d+$/.test(id);
};

exports.isEmpty = function(obj) {
    return 0 === Object.keys(obj).length;
};