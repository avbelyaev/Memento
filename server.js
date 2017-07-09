/**
 * Created by anthony on 07.05.17.
 */
const http          = require("http");


function start(app, config) {

    http.createServer(app).listen(config.port, function () {
        console.log('server has started. port ' + config.port);
    });

    process.on('SIGINT', function () {
        console.log('terminating server');
        process.exit();
    });
}


exports.start = start;