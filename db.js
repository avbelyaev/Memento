/**
 * Created by anthony on 16.05.17.
 */
const MongoClient       = require('mongodb').MongoClient;
const config            = require('./config/config');


function connect() {
    MongoClient.connect(config.mongoUrl, function (err, db) {
        if (err) {
            return console.log('db connection error: ' + err);
        }
        console.log("db connection has been set");

        var collection = db.collection('unicorns');
        var found = collection.find().toArray(function (err, items) {
           console.log("found: " + items.length);
        });

        db.on('error', function(err) {
            console.log("error: " + err);
        });

        db.once('open', function() {
            console.log("database has been connected");
        });

        return db;
    });
}

exports.connect = connect;