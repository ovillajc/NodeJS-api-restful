const dbvalidators  = require('./dbValidators');
const generarJWT    = require('./generarJwt');
const googleVerify  = require('./googleVerify');
const subirArchivo  = require('./subirArchivo');

module.exports = {
    ...dbvalidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}