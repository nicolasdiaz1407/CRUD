// controllers.js
const connection = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config'); // Crea un archivo config.js para almacenar tu secreto JWT

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    try {
      const { nombre, email, contraseña } = req.body;
  
      // Verifica si el email ya está registrado
      const emailExistente = await verificarEmailExistente(email);
      if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
  
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);
  
      // Insertar nuevo usuario en la base de datos
      const insertQuery = 'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)';
      await connection.query(insertQuery, [nombre, email, hashedPassword]);
  
      return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  };
  
  // Función para iniciar sesión y generar un token JWT
  const iniciarSesion = async (req, res) => {
    try {
      const { email, contraseña } = req.body;
  
      // Obtener el usuario por el email
      const usuario = await obtenerUsuarioPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
  
      // Verificar la contraseña
      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!contraseñaValida) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
  
      // Generar token JWT
      const token = jwt.sign({ usuario_id: usuario.id }, JWT_SECRET, { expiresIn: '1h' });
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  };
  
// Función auxiliar para verificar si el email ya está registrado
const verificarEmailExistente = async (email) => {
    const [results] = await connection.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return results.length > 0;
  };
  
  // Función auxiliar para obtener un usuario por su email
  const obtenerUsuarioPorEmail = async (email) => {
    const [results] = await connection.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return results[0];
  };

// Función para crear una tarea
const crearTarea = (req, res) => {
    const { titulo, descripcion, fecha_vencimiento, estado, usuario_id, categoria_id } = req.body;
  
    const query = 'INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, estado, usuario_id, categoria_id) VALUES (?, ?, ?, ?, ?, ?)';
  
    connection.query(query, [titulo, descripcion, fecha_vencimiento, estado, usuario_id, categoria_id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear la tarea' });
      }
  
      const tareaId = results.insertId;
      return res.status(201).json({ id: tareaId, mensaje: 'Tarea creada exitosamente' });
    });
  };

// Función para obtener todas las tareas
const obtenerTodasLasTareas = (req, res) => {
    const query = 'SELECT * FROM tareas';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener las tareas' });
      }
  
      return res.status(200).json(results);
    });
  };

// Función para obtener una tarea por su ID
const obtenerTareaPorId = (req, res) => {
    const tareaId = req.params.id;
  
    const query = 'SELECT * FROM tareas WHERE id = ?';
  
    connection.query(query, [tareaId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la tarea' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      const tarea = results[0];
      return res.status(200).json(tarea);
    });
  };

// Función para actualizar una tarea por su ID
const actualizarTareaPorId = (req, res) => {
    const tareaId = req.params.id;
    const { titulo, descripcion, fecha_vencimiento, estado, usuario_id, categoria_id } = req.body;
  
    const query = 'UPDATE tareas SET titulo=?, descripcion=?, fecha_vencimiento=?, estado=?, usuario_id=?, categoria_id=? WHERE id=?';
  
    connection.query(query, [titulo, descripcion, fecha_vencimiento, estado, usuario_id, categoria_id, tareaId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar la tarea' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      return res.status(200).json({ mensaje: 'Tarea actualizada exitosamente' });
    });
  };

// Función para eliminar una tarea por su ID
const eliminarTareaPorId = (req, res) => {
    const tareaId = req.params.id;
  
    const query = 'DELETE FROM tareas WHERE id=?';
  
    connection.query(query, [tareaId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar la tarea' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
      return res.status(200).json({ mensaje: 'Tarea eliminada exitosamente' });
    });
  };

module.exports = {
  registrarUsuario,
  iniciarSesion,
  crearTarea,
  obtenerTodasLasTareas,
  obtenerTareaPorId,
  actualizarTareaPorId,
  eliminarTareaPorId,
};
