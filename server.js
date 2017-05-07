/**
 * Created by anthony on 07.05.17.
 */

const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const app           = express();
const http          = require("http");

const port = 8888;

function start() {
    http.createServer(function (rq, rsp) {
        console.log("request recieved");

        rsp.writeHead(200, {"Content-Type": "text/plain"});
        rsp.write("hello world");
        rsp.end();

    }).listen(port);

    console.log("server has started");
}

function say(word) {
    console.log("hello " + word);
}


exports.start = start;
exports.say = say;