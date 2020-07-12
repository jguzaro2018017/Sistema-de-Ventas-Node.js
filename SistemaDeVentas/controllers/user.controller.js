'use strict'

var User = require('../models/user.model');
var jwt = require('../services/jwt');
var bcrypt = require('bcrypt-nodejs');
var Bill = require('../models/bill.model');


function saveUser(req, res){//Crear Administrador
    var user = new User();  
    var dates = req.body;


    if(dates.dpi && dates.name && dates.lastname && dates.nit && dates.username && dates.password){
        User.findOne({$or: [{username: dates.username}, {dpi: dates.dpi}]}, (err, userFound)=>{
            if(err){
                res.status(500).send({message: 'Error general en la peticion, intentelo mas tarde'})
            }else if(userFound){
                res.send({message: 'Este numero de DPI y nombre de usuario ya estan en uso'});
            }else{
                user.dpi = dates.dpi;
                user.name = dates.name;
                user.lastname = dates.lastname;
                user.nit = dates.nit;
                user.username = dates.username;
                user.password = dates.password
                user.role = 'ADMINISTRADOR'

                bcrypt.hash(dates.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al encriptar contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general en la peticion, intentelo mas tarde'}) 
                            }else if(userSaved){
                                res.send({message: 'Usuario de rol ' + userSaved.role  + ' registrado correctamente', userSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido crear el usuario correctamente'});
                            }
                        });
                    }else{
                        res.status(404).send({message: 'Error inesperado'})
                    }
                });
            }
        });
    }else{
        res.status(404).send({message: 'Debe ingresar todos los datos necesario'});
    }
}

function createUser(req, res){//Usuario creado por un administrador
    var user = new User();  
    var dates = req.body;

    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No tiene permiso para realizar esta accion'})
    }else{
        
        if(dates.dpi && dates.name && dates.lastname && dates.nit && dates.username && dates.password){
            User.findOne({$or: [{username: dates.username}, {dpi: dates.dpi}]}, (err, userFound)=>{
                if(err){
                    res.status(500).send({message: 'Error general en la peticion, intentelo mas tarde'})
                }else if(userFound){
                    res.send({message: 'Este numero de DPI y nombre de usuario ya estan en uso'});
                }else{
                    user.dpi = dates.dpi;
                    user.name = dates.name;
                    user.lastname = dates.lastname;
                    user.nit = dates.nit;
                    user.username = dates.username;
                    user.password = dates.password
                    user.role = dates.role;

                    bcrypt.hash(dates.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general en la peticion, intentelo mas tarde'}) 
                                }else if(userSaved){
                                    res.send({message: 'Usuario de rol ' + userSaved.role  + 'registrado correctamente', userSaved});
                                }else{
                                    res.status(404).send({message: 'No se ha podido crear el usuario correctamente'});
                                }
                            });
                        }else{
                            res.status(404).send({message: 'Error inesperado'})
                        }
                    });
                }
            });
        }else{
        res.status(404).send({message: 'Debe ingresar todos los datos necesario'});
        }
    }
}

function saveClient(req, res){//Registro de un cliente
    var user = new User();  
    var dates = req.body;

    if(dates.dpi && dates.name && dates.lastname && dates.nit && dates.username && dates.password){
        User.findOne({$or: [{username: dates.username}, {dpi: dates.dpi}]}, (err, userFound)=>{
            if(err){
                res.status(500).send({message: 'Error general en la peticion, intentelo mas tarde'})
            }else if(userFound){
                res.send({message: 'Este numero de DPI y nombre de usuario ya estan en uso'});
            }else{
                user.dpi = dates.dpi;
                user.name = dates.name;
                user.lastname = dates.lastname;
                user.nit = dates.nit;
                user.username = dates.username;
                user.password = dates.password
                user.role = 'CLIENTE'

                bcrypt.hash(dates.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al encriptar contraseña'});
                    }else if(passwordHash){
                        user.password = passwordHash;

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general en la peticion, intentelo mas tarde'}) 
                            }else if(userSaved){
                                res.send({message: 'Usuario de rol ' + userSaved.role + ' registrado correctamente', userSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido crear el usuario'})
                            }
                        });
                    }else{
                        res.status(404).send({message: 'Error inesperado'})
                    }
                });
            }
        });
    }
}

function removeUser(req, res){
    var idUser = req.params.id

    if(idUser != req.params.id){
        res.status(403).send({message: 'No tiene permisos para realizar esta accion'});
    }else{
        User.findByIdAndRemove(idUser, (err, userRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
            }else if(userRemoved){
                res.send({message: 'Usuario ' + userRemoved.name + ' ' +  userRemoved.lastname + ' Eliminado correctamente'});
            }else{
                res.status(404).send({message: 'No se ha podido eliminar el usuario'});
            }
        })
    }

}

function removeUserbyAdmin(req, res){
    var idUser = req.params.id

    if(req.params.role == 'ADMINISTRADOR'){
        res.status(403).send({message: 'Error general al realizar la peticion, intente de nuevo'});
    }else{
        User.findById(idUser, (err, userFind)=>{
            if(err){
                res.status(403).send({message: 'Error general al realizar la peticion, intente de nuevo'});
            }else if(userFind){
                if(userFind.role == 'CLIENTE'){
                    User.findByIdAndRemove(idUser, (err, userRemoved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
                        }else if(userRemoved){
                            res.send({message: 'Usuario ' + userRemoved.name + ' ' +  userRemoved.lastname + ' Eliminado correctamente'});
                        }else{
                            res.status(404).send({message: 'No se ha podido eliminar el usuario'});
                        }
                    })
                }
            }else{
                res.status(404).send({message: 'No se ha encontrado el usuario'});
            }
        })
    }
    
}

function getUsers(req, res){
    User.find({}.exec, (err, usersGotten)=>{
        if(err){
            res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
        }else if(usersGotten){
            res.status(200).send({message: 'Listado de usuarios', usersGotten})
        }else{
            res.status(404).send({message: 'No se han podido listar los usuarios existentes'});
        }
    })
}

function updateUser(req, res){
    var idUser = req.params.id;
    var dates = req.body;

    if(idUser != req.user.sub){
        res.status(403).send({message: 'No tienes derechos para realizar esta accion'});
    }else{
        if(dates.role || dates.nit || dates.dpi){
            return res.status(404).send({message: 'No se pueden editar esos datos'});
        }else{
            User.findByIdAndUpdate(idUser, dates, {new: true}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
                }else if(userUpdated){
                    res.send({message: 'Usuario ' + userUpdated.name + ' ' + userUpdated.lastname + ' Actualizado correctamente', userUpdated});
                }else{
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }
            });
        }
    }
}

function updateUserbyAdmin(req, res){
    var idUser = req.params.id
    var dates = req.body;

    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No tiene permisos para realizar esta accion'})
    }else{
        User.findById(idUser, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
            }else if(userFind){
                if(userFind.role == 'ADMINISTRADOR'){
                    res.status(403).send({message: 'No puede editar los datos de un administrador'});
                }else{
                    User.findByIdAndUpdate(idUser, dates, {new: true}, (err, userUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
                        }else if(userUpdated){
                            res.send({message: 'Usuario ' + userUpdated.name + ' ' + userUpdated.lastname + ' Actualizado correctamente', userUpdated});
                        }else{
                            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                        }
                    });
                }
            }else{

            }
        });

    }
}

function updateAdminYourself(req, res){
    var idUser = req.params.id;
    var dates = req.body

    if(idUser != req.user.sub){
        res.status(403).send({message: 'No puede actualizar los datos de alguien que es administrador'});
    }else{
        User.findByIdAndUpdate(idUser, dates, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
            }else if(userUpdated){
                res.send({message: 'Usuario ' + userUpdated.name + ' ' + userUpdated.lastname + ' Actualizado correctamente', userUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }
        });
    }
}

function login(req, res){
    var dates = req.body;

    if(dates.username){
        if(dates.password){
            User.findOne({username: dates.username}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(dates.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(dates.gettoken = true){
                                    res.send({token: jwt.createToken(check)});
                                }else{
                                    res.send({message: 'Bienvenido',user:check});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                });
        }else{
           res.send({message: 'Ingresa tu contraseña'}); 
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu username'});
    }
}

function findBillClient(req, res){
    var idUser = req.params.id;

    if(idUser != req.user.sub){
        res.status(403).send({message: 'No se han podido encontrar las facturas de los usuarios'});
    }else{
        Bill.find({buyer: idUser}, (err, billFound)=>{
            if(err){
                res.status(500).send({message: 'Erro general con la peticion, intente de nuevo'})
            }else if(billFound){   
                res.send({message: 'Facturas del usuario', billFound});
            }else{
                res.status(404).send({message: 'No se han podido encontrar las facturas del usuario'});
            }
        });
    }
}


module.exports = {
    saveUser,
    saveClient,
    login,
    removeUser,
    getUsers,
    updateUser,
    createUser,
    updateUserbyAdmin,
    updateAdminYourself,
    findBillClient
}

