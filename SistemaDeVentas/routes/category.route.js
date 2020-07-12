'use strict'

var express = require('express');
var categoryController = require('../controllers/category.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveCategory', /* mdAuth.ensureAuthAdmin, */ categoryController.saveCategory);
api.get('/listCategory', /* mdAuth.ensureAuth, */ categoryController.listCategories);
api.delete('/removeCategory/:id', /* mdAuth.ensureAuthAdmin, */ categoryController.removeCategory);
api.put('/updateCategory/:id', /* mdAuth.ensureAuthAdmin, */ categoryController.updateCategory);



module.exports = api;