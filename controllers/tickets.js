const {response} = require('express');
const {Ticket} = require('../models/index');

// Obtener Tickets - [Total, paginado, populate]

const obtenerTickets = async(req, res = response) => {

    // Obtener tickets de manera paginada
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, ticket] = await Promise.all([
        Ticket.countDocuments(query),
        Ticket.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        // Enviamos los datos del usuario
        .populate('usuario', 'nombre')
        .populate('tour', 'nombre')
    ]);

    // Devolvemos la respuesta del conteo
    res.json({
        total,
        ticket
    });
}

// Obtener un ticket
const obtenerTicket = async(req, res = response ) => {

    const { id } = req.params;
    const ticket = await Ticket.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('tour', 'nombre');

    res.json( ticket );

}

// Crear un ticket
const crearTicket = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const ticketDB = await Ticket.findOne({nombre: body.nombre});

    if (ticketDB) {
        return res.status(400).json({
            msg: `El ticket ${ticketDB.nombre}, ya existe`
        });
    }

    // Generar los datos a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }
    const ticket = new Ticket(data);

    // Guardamos en db
    await ticket.save();
    res.status(201).json(ticket);
}

// Actualiza ticket
const actualizarTicket = async(req, res) => {
    // Obtenemos la data que nos envian al end point
    const {id} = req.params;
    // Recordar que tenemos que excluir los campos que no queremos que se actualice
    const {estado, usuario, ...data} = req.body;

    // Solo se modifica el nombre a mayusculas si viene en la data
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const ticket = await Ticket.findByIdAndUpdate(id, data, {new: true});
    
    res.json(ticket );
}

// Borrar Ticket - estado:false
const borrarTicket = async(req, res =response) => {
    const {id} = req.params;
    const ticketBorrado = await Ticket.findByIdAndUpdate(id, {estado: false}, {new:true});
    
    res.json(ticketBorrado);
}


module.exports = {
    crearTicket,
    obtenerTickets,
    obtenerTicket,
    actualizarTicket,
    borrarTicket
}