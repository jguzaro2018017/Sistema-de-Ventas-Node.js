'use strict'

var ShoppingCart = require('../models/shoppingcart.model');
var Product = require('../models/products.model');
var User = require('../models/user.model');

function saveShoppingCart(req, res){
    var dates = req.body
    var shcr = new ShoppingCart(); //Instancia del modelo de Carrito de compras

    if(dates.idClient){
        ShoppingCart.findOne({client: dates.idClient}, (err, shcrFound)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion'});
            }else if(shcrFound){
                res.send({message: 'Este Cliente ya cuenta con un carrito de compras'});
            }else{
                shcr.client = dates.idClient
                
                shcr.save((err, shcrSaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al realizar la peticion'});
                    }else if(shcrSaved){
                        res.send({message: 'Carrito de compras generado correctamente'});
                    }else{
                        res.status(404).send({message: 'No se ha podido registrar el corrito de compras'});
                    }
                })
            }
        });
    }else{
        res.status(404).send({message: 'Debe ingresar los datos necesarios'});
    }
}

function addProduct(req, res){
    var idShcr = req.params.idShcr;
    var dates = req.body;
    var prueba = String;
    var cantidad = Number;
    

    if(dates.nameProduct){
        Product.findOne({nameProduct: dates.nameProduct}, (err, productFound)=>{

            if(err){
                res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
            }else if(productFound){
                ShoppingCart.findOne({_id: idShcr, buy: {$elemMatch: {nameProduct: dates.nameProduct}}}, {'buy.$':1}, (err, shcrF)=>{
                    if(err){
                        res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                    }else if(shcrF){
                        prueba = shcrF.buy[0].nameProduct;
                        cantidad = shcrF.buy[0].quantity;
                        ShoppingCart.findOneAndUpdate({_id: idShcr, 'buy.nameProduct': dates.nameProduct}, {'buy.$.quantity': parseInt(cantidad) + parseInt(dates.quantity)}, {new:true}, (err, qUpdated)=>{
                            if(err){
                                res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                            }else if(qUpdated){
                                res.send({message: 'Productos agregados correctamente al carrito de compras', qUpdated});
                            }else{
                                res.status(404).send({message: 'Productos agregados correctamente al carrito de compras', shcrUpdated});
                            }
                        })
                    }else{
                        ShoppingCart.findByIdAndUpdate(idShcr, {$push: {buy:{nameProduct: dates.nameProduct, quantity: dates.quantity, price: dates.price, subtotal: parseInt(dates.quantity) * parseInt(dates.price)}}}, {new: true}, (err, shcrUpdated)=>{
                            if(err){
                                res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                            }else if(shcrUpdated){
                                res.send({message: 'Productos agregados correctamente al carrito de compras', shcrUpdated});
                            }else{
                                res.status(404).send({message: 'No se han podido agregar los productos'});
                            }
                        });
                    }

                })

            }else{
                res.status(404).send({message: 'Error al buscar el producto'});
            }
        })
    }else{
        res.status(404).send({message: 'Debe ingresar todso los datos'});
    }
}



function listShoppingCart(req, res){
    ShoppingCart.find({}.exec, (err, shcrList)=>{
        if(err){
            res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
        }else if(shcrList){
            res.send({message: 'Listado de Carritos de Compras', shcrList});
        }else{
            res.status(404).send({message: 'No se han podido listar los registros'});
        }
    }).populate('client')
}

function deleteProduct(req, res){
    var idShcr = req.params.idShcr
    var dates = req.body;


    ShoppingCart.findOneAndUpdate({_id: idShcr}, {$pull:{buy: {_id: dates.idProduct}}},{new: true},(err, productRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
        }else if(productRemoved){
            res.send({message: 'Producto eliminado del carrito de compras', productRemoved});
        }else{
            res.status(404).send({message: 'No se ha podido eliminar el producto'})
        }
    })
}



function removeShoppingCart(req, res){
    var idShcr  = req.params.id

    ShoppingCart.findById(idShcr, (err, shcrFound)=>{
        if(err){
            res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
        }else if(shcrFound){
            ShoppingCart.findByIdAndRemove(idShcr, (err, shcrRemoved)=>{
                if(err){
                    res.status(500).send({message: 'Error general al realizar la peticion, intente de nuevo'});
                }else if(shcrRemoved){
                    res.send({message: 'Carrito de compras eliminado correctamente', shcrRemoved})
                }else{  
                    res.status(404).send({message: 'No se ha podido eliminar el carrito de compras'})
                }
            });
        }else{
            res.send({message: 'Este usuario no existe'});
        }
    })
}

module.exports = {
    saveShoppingCart,
    addProduct,
    listShoppingCart,
    deleteProduct,
    removeShoppingCart,
    removeShoppingCart

}