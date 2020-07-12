'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = Schema({
    nitBill: Number,
    date: Date,
    site: String,
    buyer: [{type: Schema.Types.ObjectId, ref: 'user'}],
    products: [{
        nameProduct: String,
        quantity: String,
        price: Number,
        subtotal: Number
    }],
    total: Number
    
})

module.exports = mongoose.model('bill', billSchema);