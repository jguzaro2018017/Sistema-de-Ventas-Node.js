'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    dpi: Number,
    name: String,
    lastname: String,
    nit: Number,
    username: String,
    password: String,
    role: String,

})

module.exports = mongoose.model('user', userSchema);
