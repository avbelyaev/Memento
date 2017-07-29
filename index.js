/**
 * Created by anthony on 07.05.17.
 */
const express           = require('express');
const server            = require("./server");
const db                = require('./db');
const dbConfig          = require('./config/dbConfig');
const serverConfig      = require('./config/serverConfig');
const logger            = require('./config/logConfig');
const router            = require('./controllers/routes/router');

var app = express();
app.use('/api', router);

server.start(app, serverConfig);
var dbInst// = db.connect(dbConfig);



exports.app = app;
exports.dbInst = dbInst;
//TODO Grunt?
