/**
 * Created by anthony on 07.05.17.
 */

function start() {
    console.log("rq handler for 'start' was called");
}

function upload() {
    console.log("rq handler for 'upload' was called");
}


exports.start = start;
exports.upload = upload;
