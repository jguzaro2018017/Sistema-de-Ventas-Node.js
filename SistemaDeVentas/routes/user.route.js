'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var app = express.Router();

app.post('/saveUser', userController.saveUser);//crear Administrador
app.post('/saveClient', userController.saveClient);//Registro de un cliente
app.post('/createUser', mdAuth.ensureAuthAdmin, userController.createUser);//Usuario creado por un administrador
app.post('/login', userController.login);
app.delete('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);
app.get('/listUsers', userController.getUsers);
app.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
app.put('/updateUserbyAdmin/:id', mdAuth.ensureAuthAdmin, userController.updateUserbyAdmin);
app.put('/updateAdminYourself/:id', mdAuth.ensureAuthAdmin, userController.updateAdminYourself);
app.get('/findBillClient/:id', mdAuth.ensureAuth, userController.findBillClient);

module.exports = app;

