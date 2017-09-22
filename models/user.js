/**
 * Created by anthony on 16.05.17.
 */
var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var log                 = require('winston');
const db                = require('../db');
const counter           = require('./counter');
const errorUtils        = require('../utils/errorUtils');
const validatorUtils    = require('../utils/validatorUtils');
const InternalError     = require('../utils/errors/InternalError');
const ValidationError   = require('../utils/errors/ValidationError');
const DocNotFoundError  = require('../utils/errors/DocNotFoundError');
const bcrypt            = require('bcrypt');


var userSchema = Schema({
    _id: Number,
    is_active: { type: Boolean, default: true },
    is_admin: { type: Boolean, default: false },
    first_name: String,
    last_name: String,
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    create_date: { type: Date, default: Date.now() }
});

userSchema.pre('save', function (next) {
    log.info('user_id inc');
    var docBeingSaved = this;


    counter.findByIdAndUpdate(
        {_id: 'user_id'},
        {$inc: {seq: 1}},
        function (err, counter) {
            if (err)
                return next(err);
            docBeingSaved._id = counter.seq;
            log.info('id: ' + docBeingSaved._id);

            next();
        });
});

userSchema.virtual('passwordEnc')
    .get(function () {
        return this._plainPassword;
    })
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            //this.salt = crypto.randomBytes(128).toString('base64');
            //this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            //this.salt = undefined;
            //this.passwordHash = undefined;
        }
    });


var userModel = mongoose.model('user', userSchema);



var findAll = function (callback) {
    log.info('users findAll');
    var ret = null;

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
    } else {

        userModel.find({}, function (err, users) {
            if (err) {
                err = new InternalError(err);
            } else {

                log.info('entries found: ' + users.length);
                ret = users ? users : [];
            }
            callback(err, ret);
        });
    }
};


var findOneById = function (idVal, callback) {
    log.info('user findOneById [' + idVal + ']');

    var id, ret = null;
    try {
        id = validatorUtils.validateAndConvertId(idVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
    } else {

        return findByAttr('_id', id, function (err, postsFound) {
            var error = ret = null;

            if (err) {
                error = new InternalError(err);

            } else {
                if (postsFound && 1 === postsFound.length) {
                    ret = postsFound;

                } else {
                    error = new DocNotFoundError({
                        message: 'not found'
                    });
                    ret = null;
                }
            }
            callback(error, ret);
        });
    }
};


var findByUsername = function (usernameVal, callback) {
    log.info('post findByUsername "' + usernameVal);

    var error = null, ret = null;
    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
        return;
    }

    userModel.find({'username': usernameVal})
        .exec()
        .then(function (userFound) {
            if (userFound && 1 === userFound.length) {
                ret = userFound;
            } else {
                ret = null;
                error = new DocNotFoundError({
                    message: 'no user found or found more than one'
                })
            }
            callback(error, ret);
        })
        .catch(function (e) {
            log.error('user model findByUsername err: ', e.message);

            callback(e, null);
        });
};


var save = function (rqBody, callback) {
    log.info('user model save');

    var ret = null;
    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);
    } else {

        var user;
        try {
            user = new userModel(rqBody);
        } catch(e) {
            log.error(e.message);
            callback(new ValidationError(e), null);
            return;
        }

        ret = null;

        return user
            .validate()
            .then(function () {

                log.info('user data is valid. hashing password');
                return bcrypt.hash(rqBody.password, 10);

            }, function (err) {
                throw new ValidationError(err);
            })
            .then(function (hash) {
                user.password = hash;

                log.info('hash has been generated. saving');
                return user.save();
            })
            .then(function (newUser) {

                if (newUser) {
                    log.info('user has been saved');
                    ret = newUser;

                } else {
                    throw new DocNotFoundError({message: 'new user not found'});
                }
            })
            .then(function () {
                callback(null, ret);
            })
            .catch(function (e) {
                log.error('user model save err: ', e.message);

                callback(e, null);
            })

    }
};


var update = function (idVal, rqBody, callback) {
    log.info('user model update by id [' + idVal + ']');

    var id, ret = null;
    try {
        id = validatorUtils.validateAndConvertId(idVal);
    } catch(e) {
        log.error('validate and convert id err: ', e.message);
        callback(e, null);
        return;
    }

    if (!db.isConnected()) {
        errorUtils.dbConnError(callback);

    } else {

        try {
            //validate against schema
            var tmp = new userModel(rqBody);
        } catch(e) {
            log.error(e.message);
            callback(new ValidationError(e), null);
            return;
        }

        ret = null;

        return userModel
            .update({_id: id}, {$set: rqBody})
            .exec()
            .then(function(affected) {
                log.info('entries affected: ', affected);

                if (0 !== affected.n) {
                    //if any was affected then find what was it
                    return userModel
                        .findOne({_id: id})
                        .exec()

                } else {
                    if (0 === affected.ok) {
                        //0 === OK when entry can't be updated
                        //then assume rqBody is incorrect
                        throw new ValidationError({message: 'cannot be updated'});
                    } else {
                        //otherwise no doc was updated
                        throw new DocNotFoundError({message: 'nothing was updated'});
                    }
                }
            })
            .then(function (updatedUser) {

                if (updatedUser) {
                    log.info('updated entry found');
                    ret = updatedUser;

                } else {
                    throw new DocNotFoundError({message: 'updated entry not found'});
                }
            })
            .then(function () {
                callback(null, ret);
            })
            .catch(function (e) {
                log.error('user model update err: ', e.message);

                callback(e, null);
            })

    }
};

var userDelete = function (idVal, callback) {
    log.info('user model delete by id [' + idVal + ']');

    var inactive = {};
    inactive['is_active'] = false;

    log.info('try safe delete by setting is_active=false');
    update(idVal, inactive, callback);
};




exports.findAll = findAll;
exports.findOneById = findOneById;
exports.findByUsername = findByUsername;
exports.save = save;
exports.update = update;
exports.delete = userDelete;