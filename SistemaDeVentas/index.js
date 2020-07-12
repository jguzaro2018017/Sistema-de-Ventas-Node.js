'use strict'

var mongoose = require('mongoose');
var port = 3900;
var app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/SalesSystem', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Conexion a la BD Correcta');
    app.listen(port, ()=>{
        console.log('Servidor a express corriendo', port);
    });
}).catch(err =>{
    console.log('Eror al conectarse', err);
});