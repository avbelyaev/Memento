/**
 * Created by anthony on 09.07.17.
 */


exports.stubNotImplemented = function (rq, rsp, reason) {
    rsp.writeHead(400, {});
    rsp.write("NOT IMPLEMENTED: " + reason);
    rsp.end();
};