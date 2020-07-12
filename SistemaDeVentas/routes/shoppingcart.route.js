'use strict'

var express = require('express');
var shcrController = require('../controllers/shoppingcart.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/saveShcr', mdAuth.ensureAuth, shcrController.saveShoppingCart);
api.put('/addProduct/:idShcr', mdAuth.ensureAuth, shcrController.addProduct);
api.get('/getShcr', mdAuth.ensureAuth, shcrController.listShoppingCart);
//api.post('/g', shcrController.prueba)
api.put('/removeProduct/:idShcr', mdAuth.ensureAuth, shcrController.deleteProduct);
//api.post('/addBill2/:idShcr', shcrController)
api.delete('/deleteShcr/:id', mdAuth.ensureAuth, shcrController.removeShoppingCart);


module.exports = api;

