/**
 * Created by anthony on 16.05.17.
 */
var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var userSchema = Schema({
    _id: Number,
    is_active: { type: Boolean, default: true },
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    password: String,
    create_date: { type: Date, default: Date.now() }
});

userSchema.virtual('full_name').get(function () {
    return this.first_name + ' ' + this.last_name;
});

var userModel = mongoose.model('user', userSchema);


