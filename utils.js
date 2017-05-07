/**
 * Created by anthony on 07.05.17.
 */

const STATUS_200 = 200,
    STATUS_500 = 500;

const CONTENT_TYPE_TEXT_PLAIN = "text/plain",
    CONTENT_TYPE_TEXT_HTML = "text/html",
    CONTENT_TYPE_IMAGE_JPG = "image/jpg",
    CONTENT_TYPE_IMAGE_PNG = "image/png";


function respond(rsp, content, status, contentType) {
    rsp.writeHead(status, {"Content-Type": contentType});
    rsp.write(content);
    rsp.end();
}


exports.respond = respond;
exports.STATUS_200 = STATUS_200;
exports.STATUS_500 = STATUS_500;
exports.CONTENT_TYPE_TEXT_PLAIN = CONTENT_TYPE_TEXT_PLAIN;
exports.CONTENT_TYPE_TEXT_HTML = CONTENT_TYPE_TEXT_HTML;
exports.CONTENT_TYPE_IMAGE_JPG = CONTENT_TYPE_IMAGE_JPG;
exports.CONTENT_TYPE_IMAGE_PNG = CONTENT_TYPE_IMAGE_PNG;