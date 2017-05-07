/**
 * Created by anthony on 07.05.17.
 */
const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const app           = express();
const http          = require("http");
const url           = require("url");
const config        = require("./config");

function start(route, handlers) {
    function onRequest(rq, rsp) {
        route(rq, rsp, handlers);
    }

    http.createServer(onRequest).listen(config.port);
    console.log("server has started");
}

function say(word) {
    console.log("hello " + word);
}


exports.start = start;
exports.say = say;