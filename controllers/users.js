const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usersGet = async(req = request, res = response) =>{
    //Obtenermos los query que envian desde el front pueden ser opcionales
    // const {q, nombre = 'Nom name', apikey, page = 1, limit} = req.query;

    // Obtener los usuarios de manera paginada
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde)) 
        .limit(Number(limite))
    ]);

    // Implemntacion de los json para devolver respuestas de la api en forma de objetos
    res.json({
        total,
        usuarios
    });
}

const usersPut = async(req, res) =>{
    //Obtenermos la data que nos envian desde el front
    const id = req.params.id;
    const {_id, password, google, correo, ...resto} = req.body;

    // TODO: Validar contra base de datos
    if (password) {
         // Hacemos el hash de la contraseña o la encriptacion
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    // Implemntacion de los json para devolver respuestas de la api en forma de objetos
    res.json(usuario);
}

const usersPost = async(req, res = response) =>{

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Realizamos configuraciones para el encriptamiento de la contraseña
    // Hacemos el hash de la contraseña o la encriptacion
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardamos los datos en la base de datos
    await usuario.save();


    // Implemntacion de los json para devolver respuestas de la api en forma de objetos
    res.json({
        ok:true,
        usuario
    });
}

const usersDelete = async(req, res = response) => {
    // Implemntacion de los json para devolver respuestas de la api en forma de objetos
    const {id} = req.params;

    // const uid = req.uid;

    //! Borrado fisico de un usuario (No recomendado)
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}



module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}