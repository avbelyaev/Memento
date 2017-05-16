/**
 * Created by anthony on 16.05.17.
 */
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var db;//        = require('././db');

var userSchema = Schema({
    _id:        Number,
    name:       String,
    login:      String,
    email:      String,
    type:       String
});

var user = mongoose.model('user', userSchema);

function create(login, name, password) {
    
    
}

function findAll() {

}
