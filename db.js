/**
 * Created by anthony on 16.05.17.
 */
const mongoose = require('mongoose');

const STATE_ALREADY_CONNECTED = 1;

exports.connect = function(cfg) {
    if (STATE_ALREADY_CONNECTED !== mongoose.connection.readyState) {
        mongoose.connect(cfg.mongoUrl, {config: {autoIndex: false}});
    }

    var db = mongoose.connection;

    db.on('error', function(err) {
        console.log("db connection err: " + err);
    });

    db.on('open', function() {
        console.log("db connection has been set");
    });
};

exports.isConnected = function () {
    return STATE_ALREADY_CONNECTED === mongoose.connection.readyState;
};