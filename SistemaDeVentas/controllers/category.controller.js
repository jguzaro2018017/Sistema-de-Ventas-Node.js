'use strict'

var Category = require('../models/category.model');

function saveCategory(req, res){
    var dates = req.body
    var category = new Category();

    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No tiene permiso para realizar esta ruta'});
    }else{
        if(dates.nameCategory){
            Category.findOne({nameCategory: dates.nameCategory}, (err, categoryFound)=>{
                if(err){
                    res.status(500).send({message: 'Error general al realizar la peticion'});
                }else if(categoryFound){
                    res.send({message: 'Esta categoria ya existe'});
                }else{
                    category.nameCategory = dates.nameCategory;
                    category.product = dates.product;
    
                    category.save((err, categorySaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al realizar la peticion'});
                        }else if(categorySaved){
                            res.send({message: 'Categoria registrada correctamente', categorySaved});
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar la categoria'});
                        }
                    });
                }
            });
        }else{
            res.status(404).send({message: 'Debe ingresar los datos necesarios'});
        }
    }


}

function listCategories(req, res){
    Category.find({}.exec, (err, listC)=>{
        if(err){
            res.status(500).send({message: 'Error general al realizar la peticion'});
        }else if(listC){
            res.send({message: 'Listado de categorias', listC});
        }else{
            res.status(404).send({message: 'No se han podido listar las categorias'});
        }
    }).populate('products');
}


function updateCategory(req, res){
    var idCategory = req.params.id;
    var dates = req.body;


    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No tiene permiso para realizar esta ruta'});
    }else{
        Category.findOneAndUpdate({_id: idCategory}, dates, {new: true}, (err, categoryUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general al realizar la peticion'});
            }else if(categoryUpdated){
                res.send({message: 'Datos de la categoria actualizados con exito', categoryUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el registro'});
            }
        })
    }

}



function removeCategory(req, res){
    var categoryId = req.params.id;
    var product = [];

    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No tiene permiso para realizar esta ruta'});
    }else{
        Category.findById(categoryId,(err, find)=>{
            if(err){
                res.status(500).send({message: 'Error'});
            }else if(find){
                if(find.products.length != 0){
                    product = find.products;
                    Category.findOneAndUpdate({nameCategory: 'Default'}, {$push: {products: product}},{new:true},(err, save)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el sistema'});
                        }else if(save){
                            Category.findByIdAndRemove(categoryId, (err, categoryRemoved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error en el sistema'});
                                }else if(categoryRemoved){
                                    res.send({message: 'Categoria eliminada con exito', category: categoryRemoved});
                                }else{
                                    res.send({message: 'Error al eliminar Categoria'});
                                }
                            });
                        }else{
                            res.send({message:'Eror General'});
                        }
                    });
                }else{
                    Category.findByIdAndRemove(categoryId, (err, categoryRemoved)=>{
                        if(err){
                            res.status(500).send({message: 'Error en el sistema'});
                        }else if(categoryRemoved){
                            res.send({message: 'Categoria eliminada con exito', category: categoryRemoved});
                        }else{
                            res.send({message: 'Error al eliminar Categoria'});
                        }
                    });
                }
            }else{
                res.send({message: 'Error sistema'});
            }
        });  
    }


}


module.exports = {
    saveCategory,
    listCategories,
    updateCategory,
    removeCategory
}