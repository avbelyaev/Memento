/**
 * Created by anthony on 07.05.17.
 */
const express           = require('express');
var app                 = express();
const server            = require("./server");
const db                = require('./db');
const dbConfig          = require('./config/dbConfig');
const serverConfig      = require('./config/serverConfig');
const logger            = require('./config/logConfig');
const router            = require('./controllers/routes/router');
const bodyParser        = require('body-parser');



app.use(function (rq, rsp, next) {
    //setting json globally before routing rq
    rsp.type('application/json');
    next();
});
app.use('/api', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


server.start(app, serverConfig);
var dbInst = db.connect(dbConfig);



exports.app = app;
exports.dbInst = dbInst;
//TODO Grunt?
