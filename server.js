/**
 * Created by anthony on 07.05.17.
 */
const express       = require('express');
const http          = require("http");
const url           = require("url");
const config        = require("./config/config");


function start(route, handlers) {
    var onRequest = function(rq, rsp) {
        route(rq, rsp, handlers);
    }

    http.createServer(onRequest).listen(config.port);
    console.log("server has started");

}


exports.start = start;