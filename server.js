/**
 * Created by anthony on 07.05.17.
 */
const express       = require('express');
const http          = require("http");
const url           = require("url");


function start(route, handlers, config) {
    var onRequest = function(rq, rsp) {
        route(rq, rsp, handlers);
    }

    http.createServer(onRequest).listen(config.port);
    console.log("server has started");

}


exports.start = start;