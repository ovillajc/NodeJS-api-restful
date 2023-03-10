const {Schema, model} = require('mongoose');

const TicketSchema = Schema({
    nombre:     {type: String, required: [true, 'El nombre es obligatorio'], unique: true},
    estado:     {type: Boolean, default: true, required: true},
    usuario:    {type: Schema.Types.ObjectId, ref: 'Usuarios', required: true},
    tour:       {type: Schema.Types.ObjectId, ref: 'Tour', required: true},
    tipoBoleto: {type: String},
    precio:     {type: Number, default: 0},
    horaInicio: {type: String, default: '00:00'},
    duracion:   {type: String, default: '3 hrs'},
    disponible: {type: Boolean, default: true}
});


TicketSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Ticket', TicketSchema);