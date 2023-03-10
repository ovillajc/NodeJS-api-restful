const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJwt');
const {googleVerify} = require('../helpers/googleVerify');

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario y/o contraseña incorrectos - correo'
            });
        }

        // Verficamos si el ususario esta activo en la bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario y/o contraseña incorrectos - estado:false'
            });
        }

        // Verficamos la contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario y/o contraseña incorrectos - password'
            });
        }

        // Generamos el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}


const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);
        
        // Generar la referencia para verificar si el correo ya existe en la base de datos
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            // Si no existe el usuario se tiene que crear
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                google:true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario esta en bd 
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generamos el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
    
}

module.exports = {
    login,
    googleSingIn
}