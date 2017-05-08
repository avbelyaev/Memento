/**
 * Created by anthony on 07.05.17.
 */
const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const app           = express();
const http          = require("http");
const url           = require("url");
const config        = require("./config");
const mongoose          = require('mongoose');

var db = mongoose.connection;


function start(route, handlers) {
    function onRequest(rq, rsp) {
        route(rq, rsp, handlers);
    }

    http.createServer(onRequest).listen(config.port);
    console.log("server has started");

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("database has been connected");
    });
}


exports.start = start;