/**
 * Created by anthony on 30.07.17
 */
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;


const counterSchema = Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 0}
});

const counterModel = mongoose.model('counter', counterSchema);

module.exports = counterModel;