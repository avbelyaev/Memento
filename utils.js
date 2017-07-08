/**
 * Created by anthony on 07.05.17.
 */

function respond(rsp, content, status, contentType) {
    rsp.writeHead(status, {"Content-Type": contentType});
    rsp.write(content);
    rsp.end();
}


exports.respond = respond;
exports.STATUS_200 = 200;
exports.STATUS_404 = 404;
exports.STATUS_500 = 500;
exports.CONTENT_TYPE_TEXT_PLAIN = "text/plain";
exports.CONTENT_TYPE_TEXT_HTML = "text/html";
exports.CONTENT_TYPE_IMAGE_JPG = "image/jpg";
exports.CONTENT_TYPE_IMAGE_PNG = "image/png";
exports.METHOD_GET = "get";
exports.METHOD_POST = "post";