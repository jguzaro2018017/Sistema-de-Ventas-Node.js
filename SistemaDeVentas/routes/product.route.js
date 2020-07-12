'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveProduct', /* mdAuth.ensureAuthAdmin,  */productController.saveProduct);
api.get('/listProducts', /* mdAuth.ensureAuthAdmin, */ productController.listProducts);
api.get('/findProduct', mdAuth.ensureAuthAdmin, productController.findProduct);
api.delete('/removeProduct', /* mdAuth.ensureAuthAdmin, */ productController.removeProducts);
api.put('/updateProduct/:id', mdAuth.ensureAuthAdmin, productController.updateProducts);
api.post('/findProductByName', mdAuth.ensureAuth, productController.findProductbyname);
api.get('/findProductExistence', productController.findProductExistence);

module.exports = api;