/**
 * Created by anthony on 07.05.17.
 */
const express           = require('express');
const server            = require("./server");
const utils             = require("./utils");
const db                = require('./db');
const dbConfig          = require('./config/dbConfig');
const serverConfig      = require('./config/serverConfig');
const router            = require('./controllers/routes/router');

var app = express();

app.use('', router);

var dbInst = db.connect(dbConfig);

server.start(app, serverConfig);


module.exports = app;

//TODO Grunt?