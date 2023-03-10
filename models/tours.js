const {Schema, model} = require('mongoose');

const TourSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        // Para indicar que el elemento usuario viene de otro modelo de mongo
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    },
    descripcion: {
        type: String
    },
    ubicacion: {
        type: String,
    },
    // actividades: {}, 
    img: {
        type: String
    },
});

TourSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();

    return data;
}

module.exports = model('Tour', TourSchema);