const Role = require('../models/rol');
const {Usuario, Tour, Ticket} = require('../models/index');

/**
 * 
 * Validadores epecializados para Usuarios 
 */

const esRolValido  = async(rol = '') => {

    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
            throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}

// verificamos si el correo existe
const emailExiste = async(correo = '') => {

    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya esta registrado`)
    }

}

const existeUsuarioPorId = async(id) => {
    // Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) {
        throw new Error(`El id ${id}, no existe`);
    }
}

/**
 * 
 * Validadores especializados para Tours
 * 
*/

const existeTourPorId = async(id) => {
    // Verficamos si el Tour existe
    const existeTour = await Tour.findById(id);
    if (!existeTour) {
        throw new Error(`El id ${id} no existe`);
    }
}

// Verficamos si el Ticket existe
const existeTicketPorId = async( id ) => {

    // Verificar si el correo existe
    const existeTicket = await Ticket.findById(id);
    if ( !existeTicket ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Validar las colecciones permitidas
*/

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;

}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeTourPorId,
    existeTicketPorId,
    coleccionesPermitidas
}