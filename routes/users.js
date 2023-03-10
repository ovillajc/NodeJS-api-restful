const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos, validarJWT, tieneRole} = require('../middleware/index');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/dbValidators');

const { usersGet, 
        usersPut, 
        usersPost,
        usersDelete} = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRolValido),
        validarCampos
], usersPut);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de tener minmo 6 caracteres').isLength({min: 6}),
        check('correo').custom(emailExiste),
        // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom(esRolValido),
        validarCampos
], usersPost);

router.delete('/:id', [
        validarJWT,
        tieneRole('ADMIN_ROLE', 'OWNER_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usersDelete);


module.exports = router;