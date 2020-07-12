'use strict'

var express = require('express');
var billController = require('../controllers/bill.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

//api.post('/addBill', billController.addBill);
api.post('/addBill2/:idShcr', mdAuth.ensureAuth, billController.addBill2);
api.post('/findBillByClient', mdAuth.ensureAuthAdmin, billController.findBillByClient);
api.get('/listBills', mdAuth.ensureAuthAdmin, billController.listBill);


module.exports = api;