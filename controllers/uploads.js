const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const {response} = require('express');
const { subirArchivo } = require('../helpers');

const {Usuarios, Tour} = require('../models/index');

const cargarArchivo = async(req, res = response) => {

    try {
        // txt, md, pdf
        // const nombre = await subirArchivo(req.files, ['txt', 'md', 'pdf'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({nombre});
    } catch (msg) {
        res.status(400).json({msg});
    }
}

const actualizarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'tour':
            modelo = await Tour.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un tour con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({msg: 'Falta validar esto'});
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();


    res.json(modelo);
}

const actualizarImagenCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'tour':
            modelo = await Tour.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un tour con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({msg: 'Falta validar esto'});
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();


    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {
    
    const {id, coleccion} = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
        break;
        case 'tour':
            modelo = await Tour.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
        default:
            return res.status(500).json({msg: 'Falta validar esto'});
    }

    // Mostrar imagenes del servidor
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathPlaceHolder);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}