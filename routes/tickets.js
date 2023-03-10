const {Router} = require('express');
const {check} = require('express-validator');

const {validarJWT, validarCampos, tieneRole, esAdminRole} = require('../middleware/index');
const { crearTicket,
    obtenerTickets,
    obtenerTicket,
    actualizarTicket,
    borrarTicket } = require('../controllers/tickets');

const {existeTourPorId, existeTicketPorId} = require('../helpers/dbValidators');

const router = Router();

/**
 * {{url}}/api/tickets
 */

// Obtener todos los tickets
router.get('/',obtenerTickets);


// Obtener tickets por id
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeTicketPorId ),
    validarCampos,
], obtenerTicket);

// Crear ticket - [privado] OWNER-ADMIN
router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'OWNER_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('tour', 'No es un id de mongo válido').isMongoId(),
    check('tour').custom(existeTourPorId),
    validarCampos
], crearTicket);

// Actualiza tickets [privado] OWNER-ADMIN
router.put('/:id', [
    validarJWT,
    // check('tour', 'No es un id de mongo válido').isMongoId(),
    check('id').custom(existeTicketPorId),
    validarCampos
], actualizarTicket);

// Borrar tickets [ONLY DEVS] ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo válido').isMongoId(),
    validarCampos
], borrarTicket);

module.exports = router;