/**
 * Created by anthony on 07.05.17.
 */
const url       = require("url");
const utils     = require("./utils");

const FUNCTION = "function";

function getPathname(rq) {
    return url.parse(rq.url).pathname;
}

function route(path, handle, rq, rsp) {
    console.log("routing rq for: " + path);

    if (FUNCTION === typeof handle[path]) {
        handle[path](rq, rsp);
    } else {
        console.log("no request handler found for: " + path);

        utils.respond(
            rsp, "404 Not found", utils.STATUS_200, utils.CONTENT_TYPE_TEXT_PLAIN);
    }
}

exports.getPathname = getPathname;
exports.route = route;