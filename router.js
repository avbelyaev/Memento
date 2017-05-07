/**
 * Created by anthony on 07.05.17.
 */
const url           = require("url");
const utils         = require("./utils");
const querystring   = require("querystring");

const FUNCTION = "function";

function getPathname(rq) {
    return url.parse(rq.url).pathname;
}

function route(rq, rsp, handlers) {
    var path = url.parse(rq.url).pathname;
    var method = rq.method;
    console.log("received " + rq.method + " request: " + path);

    var handler = handlers.filter(function(obj) {
       return path.toLowerCase() === obj.path.toLowerCase() &&
           method.toLowerCase() === obj.method.toLowerCase();
    })[0];

    if (handler && FUNCTION === typeof handler.controller) {

        handler.controller(rq, rsp);

    } else {
        console.log("no request handler found for: " + path);
        utils.respond(
            rsp, "404 Not found", utils.STATUS_200, utils.CONTENT_TYPE_TEXT_PLAIN);
    }
}

exports.getPathname = getPathname;
exports.route = route;