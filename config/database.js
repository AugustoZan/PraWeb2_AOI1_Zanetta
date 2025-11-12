const mysql = require('mysql2');

// Se crea pool de conexiones con configuración UTF-8 para que no haya problemas con los acentos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agrotrack',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z'
});

// Convertir a promesas para usar async/await
const promisePool = pool.promise();

// Esta función está para verificar la conexión
async function testConnection() {
  try {
    const connection = await promisePool.getConnection();
    
    // En la sesión se configura automáticamente en formato UTF-8
    await connection.query("SET NAMES 'utf8mb4'");
    await connection.query("SET CHARACTER SET utf8mb4");
    await connection.query("SET character_set_connection=utf8mb4");
    
    console.log('✅ Conexión a MySQL exitosa (UTF-8 configurado)');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    return false;
  }
}

// Se prueba conexión al iniciar
testConnection();

// Se exporta el pool con promesas
module.exports = promisePool;