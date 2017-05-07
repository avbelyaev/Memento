/**
 * Created by anthony on 07.05.17.
 */
const url = require("url");

const FUNCTION = "function";

function getPathname(rq) {
    return url.parse(rq.url).pathname;
}

function route(path, handle) {
    console.log("routing rq for: " + path);

    if (FUNCTION === typeof handle[path]) {
        handle[path]();
    } else {
        console.log("no request handler found for: " + path);
    }
}

exports.getPathname = getPathname;
exports.route = route;