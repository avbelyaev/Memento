/**
 * Created by anthony on 07.05.17.
 */
const server            = require("./server");
const router            = require("./router");
const requestHandlers   = require("./requestHandlers");
const utils             = require("./utils");
const db                = require('./db');
const dbConfig          = require('./config/dbConfig');
const serverConfig      = require('./config/serverConfig');


var handlers = [{
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
    },
    {
        path: "/showMeme",
        method: utils.METHOD_GET,
        controller: requestHandlers.showMeme
    }
];

var dbInst = db.connect(dbConfig);
server.start(router.route, handlers, serverConfig);

