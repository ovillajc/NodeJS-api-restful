const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    apellidos: {
        type: String,
        // required: [true, 'Los apellidos son obligatorios'],
    },
    edad: {
        type: Number,
    },
    sexo: {
        type: String
    },
    pais: {
        type: String
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    telefono: {
        type: Number,
        // required: [true, 'El telefono es obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'OWNER_ROLE','USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// funcion que nos permite sobreescribir toJson para evitar enviar la contraseña en la respuesta
UsuarioSchema.methods.toJSON = function () {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}


module.exports = model('Usuarios', UsuarioSchema);