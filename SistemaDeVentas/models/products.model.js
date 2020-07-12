'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    nameProduct: String,
    quantity: Number,
    price: Number,
    sales: Number
});

module.exports = mongoose.model('product', productSchema);