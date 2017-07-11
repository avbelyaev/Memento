/**
 * Created by anthony on 07.05.17.
 */
const express           = require('express');
const server            = require("./server");
const db                = require('./db');
const dbConfig          = require('./config/dbConfig');
const serverConfig      = require('./config/serverConfig');
const router            = require('./controllers/routes/router');

var app = express();
app.use('', router);

server.start(app, serverConfig);

function connectToDb(callback) {
    db.connect(dbConfig, callback);
}

exports.app = app;
exports.connectToDb = connectToDb;

//TODO Grunt?
