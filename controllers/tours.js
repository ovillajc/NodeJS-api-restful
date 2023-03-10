const { response } = require('express');
const {Tour} = require('../models/index');


// Obtener Tours - total - paginado - populate
const obtenerTours = async(req, res = response) => {
    
    // Obtener tours de manera paginada
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, tours] = await Promise.all([
        Tour.countDocuments(query),
        Tour.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
    ]);

    // Devolvemos el conteo de los tours
    res.json({
        total,
        tours
    });
}

// Obtener Tour por id- populate
const obtenerTour = async(req, res = response) => {
    
    // Extraemos el id
    const {id} = req.params;
    
    const tour = await Tour.findById(id).populate('usuario', 'nombre');

    res.json(tour);
    
}

// Crear un ticket
const crearTour = async(req, res = response) => {
    const nombre =  req.body.nombre.toUpperCase();

    const tourDB = await Tour.findOne({nombre});

    if (tourDB) {
        return res.status(400).json({
            msg: `El tour ${tourDB.nombre}, ya existe`
        });
    }

    // Generar los datos a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const tour = new Tour(data);
    
    // Guardar en db
    await tour.save();

    res.status(201).json(tour);

}

// Actualizar tour
const actualizarTour = async(req, res) => {
    // Obtenemos la data que nos envian al end point
    const {id} = req.params;

    // Recordar que tenemos que excluir los campos que no queremos que se actualice
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const tour = await Tour.findByIdAndUpdate(id, data, {new: true});
    
    res.json(tour);
}

// Borrar tour - estado:false
const borrarTour = async(req, res =response) => {
    const {id} = req.params;
    const tourBorrado = await Tour.findByIdAndUpdate(id, {estado: false}, {new:true});
    
    res.json(tourBorrado);
}


module.exports = {
    crearTour,
    obtenerTours,
    obtenerTour,
    actualizarTour,
    borrarTour
}