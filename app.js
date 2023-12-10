// app.js

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); // Asegúrate de que el nombre del archivo coincida con tu configuración de base de datos

const app = express();

app.use(bodyParser.json());

const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
