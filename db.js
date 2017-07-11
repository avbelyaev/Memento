/**
 * Created by anthony on 16.05.17.
 */
const mongoose = require('mongoose');


function connect(cfg, callback) {
    mongoose.connect(cfg.mongoUrl, { config: { autoIndex: false } });
    var db = mongoose.connection;

    db.on('error', function(err) {
        console.log("error while trying to connect to db: " + err);
    });

    db.on('open', function() {
        console.log("db connection has been set");

        callback(db);
    });
}

exports.connect = connect;