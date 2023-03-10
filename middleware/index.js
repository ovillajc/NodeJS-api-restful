const validarCampos = require('../middleware/validarCampos');
const validarJWT = require('../middleware/validarJwt');
const validaRoles = require('../middleware/validarRoles');
const validarArchivo = require('../middleware/validarArchivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}