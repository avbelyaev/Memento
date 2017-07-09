/**
 * Created by anthony on 16.05.17.
 */
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var db;//        = require('././db');

var userSchema = Schema({
    _id: Number,
    first_name: String,
    last_name: String,
    login: String,
    email: String,
    type: String
});

var userModel = mongoose.model('user', userSchema);

userSchema.virtual('full_name').get(function () {
    return this.first_name + ' ' + this.last_name;
});

//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
userSchema.virtual('url').get(function () {
    //TODO what to do with this rels
    return 'rel/user/' + this._id;
});

function create(_login, _name) {
    userModel.create({
        name: _name,
        login: _login,
        email: 'test@test.com',
        type: 'regular'
    }, function (err, usr) {
        if (err) {
            console.log('error while trying to create user with login "' + _login + '"');
        } else {
            console.log('entity with login "' + _login + '" was created');
        }
    });
}

function findByLogin(_login) {
    userModel.find({login: _login}, function (err, usr) {
        if (err) {
            console.log('err while trying to get user by login"' + _login + '"');
        } else {
            return usr;
        }
    })
}



function findAll() {
    userModel.find({}, function (err, users) {
        if (err) {
            console.log('err while trying to fetch all users');
        } else {
            console.log('there were fetched ' + users.length + ' entities');
            return users;
        }
    })
}
