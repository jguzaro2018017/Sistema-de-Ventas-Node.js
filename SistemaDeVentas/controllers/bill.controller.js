'use strict'

var Bill = require('../models/bill.model');
var Product = require('../models/products.model');
var ShoppingCart = require('../models/shoppingcart.model');



function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function today(){
    var d = new Date();
        var dd = d.getDate();
        var mm = d.getMonth()+1;
        var yyyy = d.getFullYear();
        dd = addZero(dd);
        mm = addZero(mm);
        return dd+'/'+mm+'/'+yyyy;
}

/* function addBill(req, res){
    var dates = req.body;
    var bill = new Bill();
    var idShcr = dates.idShcr;
    var idBill = String;
    var arrayShcr = [];
    var tot = Number;
    
    if(dates.confirmarCompra == 'si'){
        if(dates.nitBill && dates.site && dates.buyer){
            bill.nitBill = dates.nitBill;
            bill.date = today();
            bill.site = dates.site;
            bill.buyer = dates.buyer;
            
            bill.save((err, billSaved)=>{
                if(err){
                    res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                }else if(billSaved){
                    idBill = billSaved._id;                    

                    ShoppingCart.findById({_id: idShcr}, (err, shcrFound)=>{
                        if(err){
                            res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                        }else if(shcrFound){
                            arrayShcr = shcrFound.buy;

                            Bill.findByIdAndUpdate(idBill, {$push:{products: arrayShcr}}, {new: true}, (err, billUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo 1'});
                                }else if(billUpdated){

                                    Bill.findByIdAndUpdate(idBill, {total: {$sum: "$products.subtotal"}}, (err, total)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo 2', err});
                                        }else if(total){
                                            console.log(total.products)
                                            res.send({message: 'Total', total})
                                        }else{
                                            res.status(404).send({message: 'No se ha podido sumar el total'});
                                        }
                                    });
                                    //res.send({message: 'Se han agregado los productos a la factura', billUpdated})
                                }else{
                                    res.status(404).send({message: 'No se han agregado los productos a la factura'})
                                }
                            })
                        }else{
                            res.status(404).send({message: 'No se ha encontrado el carrito de compras'});
                        }
                    })

                }else{
                    res.status(404).send({message: 'Error al realizar la factura'});
                }
            })
        }
    }else{
        res.status(404).send({message: 'Debe confirmar su compra'})
    }
} */

function addBill2(req, res){
    var idShcr = req.params.idShcr
    var bill = new Bill();
    var total = 0;
    var dates = req.body;
    var idBill = String;
    var descontar = String;
    if(req.user.sub != dates.client){
        res.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        if(dates.confirmarCompra == 'si'){
            if(dates.nitBill && /* dates.date && */ dates.site && dates.buyer){    
                ShoppingCart.findById(idShcr, (err, found)=>{
                    if(err){
                        res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                    }else if(found){
                        found.buy.forEach(element=>{
                            total = parseInt(total) + parseInt(element.subtotal);

                        });
                        bill.nitBill = dates.nitBill
                        bill.date = today();
                        bill.site = dates.site;
                        bill.buyer = dates.buyer;
                        bill.products = found.buy;
                        bill.total = parseInt(total);

                        bill.save((err, billSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error al realizar la peticion, intente de nuevo'});
                            }else if(billSaved){
                                idBill = billSaved.id;
                                res.send({message: 'Factura guardada', billSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido agregar la factura'});
                            }
                        });
                    }else{
                        res.send({message: 'Error'})
                    }
                })
            }else{
                res.status(404).send({message: 'Debe ingresar todos los datos'});
            }
        }else{
            res.send({message: 'Debe confirmar su compra'})
        }
    }
}

function findBillByClient(req, res){
    var dates = req.body;

    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No se han podido encontrar las facturas de los usuarios'});
    }else{
        Bill.find({buyer: dates.idClient}, (err, billFound)=>{
            if(err){
                res.status(500).send({message: 'Erro general con la peticion, intente de nuevo'})
            }else if(billFound){   
                res.send({message: 'Facturas del usuario', billFound});
            }else{
                res.status(404).send({message: 'No se han podido encontrar las facturas de los usuarios'});
            }
        });
    }

}

function listBill(req, res){
    if(req.user.role != 'ADMINISTRADOR'){
        res.status(403).send({message: 'No se han podido encontrar las facturas de los usuarios'});
    }else{
        Bill.find({}.exec, (err, listB)=>{
            if(err){
                res.status(500).send({message: 'Erro general con la peticion, intente de nuevo'})
            }else if(listB){
                res.send({message: 'Facturas ', listB});
            }else{
                res.status(404).send({message: 'NO se han podido listar las facturas'});

            }
        }).populate('buyer')
    }
}




module.exports = {
    addBill2,
    findBillByClient,
    listBill
}

