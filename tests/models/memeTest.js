/**
 * Created by anthony on 08.07.17.
 */
var db  = require('../db');
var meme = require('../../models/meme');

function testGetMemeByTitle() {
    var title = "Welcome to the feelsbar. Here to listen and give advice."
    var imgData = "some data";

    db.connect();
    meme.save(title, imgData);


}