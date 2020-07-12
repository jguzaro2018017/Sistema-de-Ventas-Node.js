'use strict'

var Product = require('../models/products.model');
var Category = require('../models/category.model');

function saveProduct(req, res){
    var dates = req.body
    var product = new Product();

/*     if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'Error de permisos para esta ruta'})
    }else{ */

        if(dates.nameProduct && dates.quantity && dates.price){
            product.nameProduct = dates.nameProduct;
            product.quantity = dates.quantity;
            product.price = dates.price

            product.save((err, productSaved)=>{
                if(err){
                    res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                }else if(productSaved){
                    Category.findOneAndUpdate({nameCategory: dates.nameCategory}, {$push: {products: product}}, (err, categoryUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                        }else if(categoryUpdated){
                            res.send({message: 'Producto registrado y agregado a una categoria', categoryUpdated});
                        }else{
                            res.status(404).send({message: 'No se ha podido agregar el producto a la categoria'});
                        }
                    }).populate('products');
                }else{
                    res.status(404).send({message: 'No se ha podido registrar el producto'})
                }
            });

        }else{
            res.send({message: 'Ingrese todos los datos necesarios'}); 
        }
    
}

function listProducts(req, res){
    
    Product.find({}.exec, (err, productsList)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'})
        }else if(productsList){
            res.send({message: 'Listado de producto' + '\n' + productsList.nameProduct + '\n' + productsList.price});
        }else{
            res.status(404).send({message: 'Error al listar los Productos'});
        }
    })
}

function updateProducts(req, res){
    var idProduct = req.params.id;
    var dates = req.body;

    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'Error de permisos para esta ruta'})
    }else{
        Product.findByIdAndUpdate(idProduct, dates, {new: true}, (err, productUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'})
            }else if(productUpdated){
                res.send({message: 'Se han actualizado los datos del producto correctamente', productUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el registro'});
            }
        });
    }
}

function removeProducts(req, res){
    var idProduct = req.params.id;
    
    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'Error de permisos para esta ruta'})
    }else{
        Product.findByIdAndRemove(idProduct, (err, productRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion'});
            }else if(productRemoved){
                res.send({message: 'Producto eliminado de la base de datos con exito', productRemoved});
            }else{
                res.status(404).send({message: 'No se ha podido eliminar el producto'});
            }
        })
    }
}

function findProduct(req, res){
    var idProduct = req.params.id;

    Product.findById(idProduct, (err, productFound)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(productFound){
            res.send({message: 'Producto encontrado', productFound});
        }else{
            res.status(404).send({message: 'No se ha encontrado el producto'});

        }
    })
}


function findProductbyname(req, res){
    var dates = req.body;
    var name = dates.name;

    Product.findOne({$or: [{"nameProduct":{$regex:"^" + dates.nameProduct, $options: "i"}}]}, (err, productFind)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(productFind){
            res.send({message: 'Producto encontrado', productFind});
        }else{
            res.status(404).send({message: 'No se ha encontrado el producto'});
        }
    });
}

function findProductExistence(req, res){

    Product.find({quantity: 0}, (err, productFound)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(productFound){
            res.send({message: 'Producto encontrado', productFound});
        }else{
            res.status(404).send({message: 'No se ha encontrado el producto'});
        }
    })
}


module.exports = {
    saveProduct,
    listProducts,
    updateProducts,
    removeProducts,
    findProduct,
    findProductbyname,
    findProductExistence

}