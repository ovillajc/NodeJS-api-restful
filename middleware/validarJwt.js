const {response, request} = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {
    
    // Primero obtenemos el jwt del header (el estandar es athorization)
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'El token no fue enviado en la peticion'
        });
    }

    // Validamos que el jwt sea correcto
    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'El token no es válido - El usuario no existe en BD'
            });
        }

        // Verificar si el uid tiene el estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'El Token no es válido - El usuario tiene el estado en false'
            });
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}