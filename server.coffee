express       = require('express');
MongoClient   = require('mongodb').MongoClient;
app           = express();

port = 8000;

start = () ->
	app.listen port, () ->
		console.log("we are live at " + port)
		
	console.log("server has started")
	
	
say = (word) ->
	console.log("hello " + word)
	
	
exports.start = start
exports.say = say