-- Se elimina la base de datos si ya existe (para rehacerla y que quede limpia)
DROP DATABASE IF EXISTS agrotrack;

-- Se crea base de datos con UTF-8, en lo posible he intentado asegurar que sea formato UTF-8 porque en más de una ocasión la base de datos me mostraba palabras acentuadas corrompidas.
CREATE DATABASE agrotrack
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Selecciona la base de datos
USE agrotrack;

-- ============================================
-- Tabla: contactos
-- Almacena las consultas de contacto de usuarios
-- ============================================
CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del contacto',
  nombre VARCHAR(100) NOT NULL COMMENT 'Nombre completo del contacto',
  email VARCHAR(150) NOT NULL COMMENT 'Correo electrónico del contacto',
  mensaje TEXT NOT NULL COMMENT 'Mensaje o consulta del contacto',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del contacto',
  INDEX idx_email (email),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabla de consultas de contacto';

INSERT INTO contactos (nombre, email, mensaje) VALUES
('Ana Martínez', 'ana@email.com', '¿Cuáles son los precios de los productos agrícolas disponibles?'),
('Pedro Gómez', 'pedro@email.com', 'Necesito información sobre distribución en mi región'),
('Laura Fernández', 'laura@email.com', 'Consulta sobre servicios de asesoramiento agrícola'),
('Carlos López', 'carlos@email.com', 'Me interesa conocer más sobre el sistema de gestión'),
('María García', 'maria@email.com', '¿Tienen soporte técnico disponible?');

-- DESCRIBE contactos;
-- SELECT * FROM contactos;