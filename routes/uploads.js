const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos, validarArchivoSubir} = require('../middleware');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

// Para crear un nuevo recurso en el servido (Carga de archivos)
router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser valido de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'tour'])),
    validarCampos
],actualizarImagenCloudinary);
// actualizarImagen

// Servir las imagenes
router.get('/:coleccion/:id', [
    check('id', 'El id debe ser valido de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'tour'])),
    validarCampos
],mostrarImagen);

module.exports = router;