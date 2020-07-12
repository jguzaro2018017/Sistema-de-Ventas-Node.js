'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_control_de_ventas_2020'

exports.createToken = (user)=>{ 
    var payload = {
        sub: user._id, 
        name: user.name,
        role: user.role,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(45, "minutes").unix()
    }

    return jwt.encode(payload, key);
}