/**
 * Created by anthony on 07.05.17.
 */
const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const app           = express();
const http          = require("http");
const url           = require("url");

const port = 8888;

function start(route, handle) {
    function onRequest(rq, rsp) {
        var pathname = url.parse(rq.url).pathname;
        console.log("request recieved: " + pathname);

        route(pathname, handle);

        rsp.writeHead(200, {"Content-Type": "text/plain"});
        rsp.write("hello world");
        rsp.end();
    }

    http.createServer(onRequest).listen(port);
    console.log("server has started");
}

function say(word) {
    console.log("hello " + word);
}


exports.start = start;
exports.say = say;