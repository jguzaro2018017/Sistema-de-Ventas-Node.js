'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shoppingCartSchema = Schema({
    client: [{type: Schema.Types.ObjectId, ref: 'user'}],
    buy: [{
        nameProduct: String,
        quantity: Number,
        price: Number,
        subtotal: Number
    }]
    
});

module.exports = mongoose.model('shoppingCart', shoppingCartSchema);