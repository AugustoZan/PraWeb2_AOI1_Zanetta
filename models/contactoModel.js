const db = require('../config/database');

// Obtener todos los contactos
async function obtenerTodos() {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, mensaje, fecha FROM contactos ORDER BY fecha DESC'
    );
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener contactos: ${error.message}`);
  }
}

// Crear un nuevo contacto
async function crear(nombre, email, mensaje) {
  try {
    const [result] = await db.query(
      'INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)',
      [nombre, email, mensaje]
    );
    
    return {
      id: result.insertId,
      nombre,
      email,
      mensaje,
      fecha: new Date()
    };
  } catch (error) {
    throw new Error(`Error al crear contacto: ${error.message}`);
  }
}

// Obtener contacto por ID
async function obtenerPorId(id) {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, mensaje, fecha FROM contactos WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Error al obtener contacto: ${error.message}`);
  }
}

module.exports = {
  obtenerTodos,
  crear,
  obtenerPorId
};