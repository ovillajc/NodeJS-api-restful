// Creamos una clase para poder trabajar con el servidor de manera modular
const express = require('express');
const cors = require('cors'); 
const fileUpload = require('express-fileupload');

const {dbConnection} = require('../database/config');

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT;

        this.paths = {
            auth:    '/api/auth',
            search:  '/api/search',
            tours:   '/api/tours',
            tickets: '/api/tickets',
            uploads: '/api/uploads',
            users:   '/api/users',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middleware
        this.midddlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    midddlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        // Fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    //Definimos las rutas de navegacion que tendra la aplicacion
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.tours, require('../routes/tours'));
        this.app.use(this.paths.tickets, require('../routes/tickets'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.users, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });        
    }
}

module.exports = Server;