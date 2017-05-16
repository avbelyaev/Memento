/**
 * Created by anthony on 16.05.17.
 */
const mongoose          = require('mongoose');
const config            = require('./config/config');


function connect() {
    mongoose.connect(config.mongoUrl, { config: { autoIndex: false } });
    var db = mongoose.connection;

    db.on('error', function(err) {
        console.log("error while connecting: " + err);
    });

    db.once('open', function() {
        console.log("db connection has been set");

        return db;
    });
}

exports.connect = connect;