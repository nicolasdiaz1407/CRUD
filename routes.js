// routes.js
const express = require('express');
const router = express.Router();
const { crearTarea, 
obtenerTodasLasTareas, 
obtenerTareaPorId,
actualizarTareaPorId,
eliminarTareaPorId,
registrarUsuario,
iniciarSesion } = require('./controllers');


// Rutas de autenticación
router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas CRUD para tareas
router.post('/tareas', crearTarea /* Función para crear una tarea */);
router.get('/tareas', obtenerTodasLasTareas /* Función para obtener todas las tareas */);
router.get('/tareas/:id', obtenerTareaPorId /* Función para obtener una tarea por su ID */);
router.put('/tareas/:id', actualizarTareaPorId /* Función para actualizar una tarea por su ID */);
router.delete('/tareas/:id', eliminarTareaPorId /* Función para eliminar una tarea por su ID */);

module.exports = router;
