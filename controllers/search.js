const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuarios, Tour, Ticket } = require('../models/index');

const coleccionesPermitidas = [
    'roles',
    'tours',
    'tickets',
    'usuarios'
];

const buscarUsuarios = async(termino = '', res = response) => {
    // Por si se desea buscar una collecion por id
    const esMongoID = ObjectId.isValid(termino); // Si es un id valido manda un true
    
    if (esMongoID) {
        const usuario = await Usuarios.findById(termino);
        return res.json({
            // Devolvemos un usuario vacio en caso de que escriban mal el id
            results: (usuario) ? [usuario] : []
        });
    }

    // Para hacer busquedas insensibles (sin escribir estrictamente igual el nombre del usuario)
    const regex = new RegExp(termino, 'i');

    // Por si desea buscar por nombre o por correo
    const usuarios = await Usuarios.find({
        $or: [{nombre: regex}, {correo: regex}],
        // Para indicar que solo aparescan usuarios con el estado activo
        $and: [{estado: true}]
    });

    res.json({
        // Devolvemos un usuario vacio en caso de que escriban mal el id
        results: usuarios
    });

}

const buscarTours = async(termino = '', res = response) => {

    // Busqueda por ID
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const tour = await Tour.findById(termino);
        return res.json({
            results: (tour) ? [tour] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    
    // Busqueda por Nombre
    const tours = await Tour.find({nombre:regex, estado:true});

    res.json({results: tours});

}

const buscarTickets = async(termino = '', res = response) => {

    // Busqueda por ID
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const ticket = await Ticket.findById(termino)
                        .populate('tour', 'nombre')
                        .populate('usuario', 'nombre');
        return res.json({
            results: (ticket) ? [ticket] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    
    // Busqueda por Nombre
    const tickets = await Ticket.find({nombre:regex, estado:true})
                        .populate('tour', 'nombre')
                        .populate('usuario', 'nombre');

    res.json({results: tickets});

}


const search =  (req, res = response) => {

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'tours':
            buscarTours(termino, res);
        break;
        case 'tickets':
            buscarTickets(termino, res);
        break;
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Olvido hacer la busqueda'
            });
    }

}

module.exports = {
    search
}