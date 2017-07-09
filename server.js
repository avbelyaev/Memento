/**
 * Created by anthony on 07.05.17.
 */
const http          = require("http");


function start(app, config) {
    /*var onRequest = function(rq, rsp) {
        route(rq, rsp, handlers);
    }*/

    http.createServer(app).listen(config.port, function () {
        console.log('server has started. port ' + config.port);
    });

    process.on('SIGINT', function () {
        console.log('terminating server');
    });
}


exports.start = start;