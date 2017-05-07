/**
 * Created by anthony on 07.05.17.
 */
const server            = require("./server");
const router            = require("./router");
const requestHandlers   = require("./requestHandlers");
const utils             = require("./utils");

var handle = [
    {
        path: "/",
        method: utils.METHOD_GET,
        controller: requestHandlers.start
    },
    {
        path: "/start",
        method: utils.METHOD_GET,
        controller: requestHandlers.start
    },
    {
        path: "/upload",
        method: utils.METHOD_POST,
        controller: requestHandlers.upload
    },
    {
        path: "/show",
        method: utils.METHOD_GET,
        controller: requestHandlers.show
    }
];


server.start(router.route, handle);
//server.say("xxx");

