require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./BACKEND API/routes');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDOC = require('swagger-jsdoc');

//define swagger option
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'Task Management API',
        },
        servers: [
            {
                url :'http://localhost:4000'
            }
            ],
    },
    apis: ['./BACKEND API/routes/*.js'],
};

//initial swagger jsdoc
const swaggerDocs = swaggerJSDOC(swaggerOptions);




const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors());
app.use(routes);
require('./BACKEND API/database/database').connectDB();


module.exports = app;
