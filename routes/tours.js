const {Router} = require('express');
const {check, checkSchema} = require('express-validator');


const {validarJWT, validarCampos, tieneRole, esAdminRole} = require('../middleware/index');
const { crearTour,
        obtenerTours,
        obtenerTour,
        actualizarTour,
        borrarTour} = require('../controllers/tours');
const { existeTourPorId } = require('../helpers/dbValidators');

const router = Router();

/**
 * {{url}}/api/tours
 */

// Obtener todos los tours - publico
router.get('/', obtenerTours);

// Obtener un tour por id
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeTourPorId),
    validarCampos
], obtenerTour);

// Crear un tour - privado owner & admin
router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'OWNER_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearTour);

// Actualizar un tour - privado owner & admin
router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'OWNER_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeTourPorId),
    validarCampos
], actualizarTour);

// Borrar un tour - owner & admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es id de mongo válido').isMongoId(),
    check('id').custom(existeTourPorId),
    validarCampos
],borrarTour);



module.exports = router;