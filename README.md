# AgroTrack V2.0

Portal interno de AgroTrack - Versión Express + MySQL

**Actividad Obligatoria 2 - Programación Web 2**

---

## 📋 Características

- ✅ Servidor Express.js
- ✅ Arquitectura MVC (Modelo-Vista-Controlador)
- ✅ Conexión a MySQL con pool de conexiones
- ✅ API REST completa (GET y POST)
- ✅ Validaciones robustas de datos
- ✅ Middleware personalizado (logger, error handler, validaciones)
- ✅ Health check endpoint
- ✅ Manejo de errores centralizado
- ✅ Variables de entorno (.env)
- ✅ Archivos estáticos desde /public
- ✅ Soporte UTF-8 completo (acentos y caracteres especiales)

---

## 🚀 Instalación

### 1. Clonar repositorio e instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales reales:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_real
DB_NAME=agrotrack
DB_PORT=3306
```

⚠️ **IMPORTANTE:** El archivo `.env` contiene credenciales sensibles y **NUNCA** debe subirse a Git.

### 3. Configurar base de datos MySQL

Ejecutar el script SQL:

```bash
mysql -u root -p < database/schema.sql
```

O desde MySQL CLI:

```sql
SOURCE database/schema.sql;
```

Esto creará:
- Base de datos `agrotrack`
- Tabla `contactos` con campos: id, nombre, email, mensaje, fecha
- Datos de ejemplo para pruebas

### 4. Iniciar servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
agrotrack/
├── config/
│   └── database.js              # Configuración MySQL con pool de conexiones
├── controllers/
│   ├── authController.js        # Lógica de autenticación
│   ├── contactController.js     # Lógica de contacto (HTML)
│   ├── contactoApiController.js # Lógica de API REST
│   └── healthController.js      # Health check
├── middlewares/
│   ├── errorHandler.js          # Manejo centralizado de errores
│   ├── requestLogger.js         # Logger de peticiones HTTP
│   └── validationMiddleware.js  # Validaciones de datos
├── models/
│   └── contactoModel.js         # Operaciones de base de datos
├── routes/
│   ├── authRoutes.js            # Rutas de autenticación
│   ├── contactRoutes.js         # Rutas de contacto (HTML)
│   ├── contactoApiRoutes.js     # Rutas API REST
│   ├── healthRoutes.js          # Ruta de health check
│   └── staticRoutes.js          # Rutas de páginas estáticas
├── database/
│   └── schema.sql               # Script de creación de BD
├── public/                      # Archivos estáticos
│   ├── index.html
│   ├── contacto.html
│   ├── login.html
│   ├── productos.html
│   ├── 404.html
│   └── estilos.css
├── data/                        # Archivos de datos generados
│   └── consultas.txt
├── .env                         # Variables de entorno (NO subir a Git)
├── .env.example                 # Plantilla de variables de entorno
├── AgroTrack_API_Tests.postman_collection.json
├── .gitignore                   # Archivos ignorados por Git
├── package.json
├── server.js                    # Servidor principal
└── README.md
```

---

## 🌐 Endpoints Disponibles

### Páginas Web (HTML)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página principal |
| GET | `/productos.html` | Página de productos |
| GET | `/contacto` | Formulario de contacto |
| GET | `/login` | Página de login |

### API REST

| Método | Ruta | Descripción | Body | Status |
|--------|------|-------------|------|--------|
| GET | `/health` | Estado del servidor y BD | - | 200 |
| GET | `/api/contactos` | Listar todos los contactos | - | 200 |
| POST | `/api/contactos` | Crear nuevo contacto | `{ nombre, email, mensaje }` | 201 |

### API Adicional (HTML)

| Método | Ruta | Descripción | Body |
|--------|------|-------------|------|
| POST | `/contacto/cargar` | Guardar consulta (HTML) | `{ nombre, email, mensaje }` |
| GET | `/contacto/listar` | Listar consultas (HTML) | - |
| POST | `/auth/recuperar` | Recuperar cuenta | `{ usuario, clave }` |

---

## 🧪 Testing y Ejemplos

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Respuesta esperada (200 OK):**
```json
{
  "status": "ok",
  "message": "Servidor funcionando correctamente",
  "server": "online",
  "timestamp": "2025-11-11T20:30:00.123Z",
  "uptime": 123.45,
  "environment": "development"
}
```

---

### 2. Listar Contactos (GET)

```bash
curl http://localhost:3000/api/contactos
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "nombre": "Ana Martínez",
      "email": "ana@email.com",
      "mensaje": "¿Cuáles son los precios de los productos agrícolas disponibles?",
      "fecha": "2025-11-11T12:56:44.000Z"
    }
  ],
  "timestamp": "2025-11-11T20:30:00.123Z"
}
```

---

### 3. Crear Contacto (POST) - Caso Exitoso

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/contactos" -Method POST -Body (@{nombre="Roberto Silva";email="roberto@email.com";mensaje="Necesito información sobre productos agrícolas disponibles"}|ConvertTo-Json) -ContentType "application/json"
```

**cURL (Bash):**
```bash
curl -X POST http://localhost:3000/api/contactos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Roberto Silva","email":"roberto@email.com","mensaje":"Necesito información sobre productos agrícolas disponibles"}'
```

**Respuesta esperada (201 Created):**
```json
{
  "success": true,
  "message": "Contacto creado exitosamente",
  "data": {
    "id": 6,
    "nombre": "Roberto Silva",
    "email": "roberto@email.com",
    "mensaje": "Necesito información sobre productos agrícolas disponibles",
    "fecha": "2025-11-11T20:30:00.123Z"
  },
  "timestamp": "2025-11-11T20:30:00.123Z"
}
```

---

### 4. Validaciones - Errores Esperados

#### a) Campo vacío (400 Bad Request)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/contactos" -Method POST -Body (@{nombre="";email="test@email.com";mensaje="Mensaje de prueba"}|ConvertTo-Json) -ContentType "application/json"
```

**Respuesta:**
```json
{
  "success": false,
  "error": "Los campos nombre, email y mensaje son obligatorios",
  "timestamp": "2025-11-11T20:30:00.123Z"
}
```

---

#### b) Email inválido (400 Bad Request)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/contactos" -Method POST -Body (@{nombre="Test Usuario";email="email-sin-arroba";mensaje="Mensaje de prueba largo"}|ConvertTo-Json) -ContentType "application/json"
```

**Respuesta:**
```json
{
  "success": false,
  "error": "El formato del email no es válido. Ejemplo: usuario@dominio.com",
  "timestamp": "2025-11-11T20:30:00.123Z"
}
```

---

#### c) Mensaje muy corto (400 Bad Request)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/contactos" -Method POST -Body (@{nombre="Test Usuario";email="test@email.com";mensaje="Hola"}|ConvertTo-Json) -ContentType "application/json"
```

**Respuesta:**
```json
{
  "success": false,
  "error": "El mensaje debe tener al menos 10 caracteres",
  "timestamp": "2025-11-11T20:30:00.123Z"
}
```

---

## 🔐 Validaciones Implementadas

La API incluye validaciones exhaustivas para garantizar la integridad de los datos:

### Validaciones de campos obligatorios:
- ✅ Todos los campos (nombre, email, mensaje) son obligatorios
- ✅ No se permiten campos vacíos o solo espacios en blanco

### Validaciones de formato:
- ✅ Email debe tener formato válido (contener @ y dominio)
- ✅ Nombre solo puede contener letras, espacios y acentos
- ✅ Email no puede contener caracteres peligrosos (`<`, `>`, `'`, `"`)

### Validaciones de longitud:
- ✅ Nombre: mínimo 2 caracteres, máximo 100
- ✅ Email: máximo 150 caracteres
- ✅ Mensaje: mínimo 10 caracteres, máximo 5000

### Sanitización:
- ✅ Eliminación de espacios en blanco al inicio y final
- ✅ Conversión de email a minúsculas
- ✅ Validación de tipos de datos

---

## 📊 Base de Datos

### Estructura de la tabla `contactos`:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Identificador único |
| `nombre` | VARCHAR(100) NOT NULL | Nombre completo del contacto |
| `email` | VARCHAR(150) NOT NULL | Correo electrónico |
| `mensaje` | TEXT NOT NULL | Mensaje o consulta |
| `fecha` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

### Índices:
- Índice en `email` para búsquedas rápidas
- Índice en `fecha` para ordenamiento

### Verificar la base de datos:

```sql
-- Ver bases de datos
SHOW DATABASES;

-- Usar la base de datos
USE agrotrack;

-- Ver tablas
SHOW TABLES;

-- Ver estructura de la tabla
DESCRIBE contactos;

-- Ver datos
SELECT * FROM contactos;
```

---

## 🛡️ Middleware

### 1. Request Logger
Registra todas las peticiones HTTP con:
- Timestamp
- Método HTTP
- URL
- IP del cliente
- User-Agent
- Body (para POST/PUT/PATCH)
- Código de estado de respuesta
- Tiempo de duración

### 2. Error Handler
Manejo centralizado de errores con:
- Códigos de estado HTTP apropiados
- Mensajes descriptivos
- Stack trace en desarrollo
- Manejo de errores de MySQL

### 3. Validation Middleware
Validaciones exhaustivas antes de procesar datos:
- 10+ reglas de validación
- Mensajes de error claros
- Sanitización de inputs

---

## 🔧 Dependencias

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 📚 Tecnologías Utilizadas

- **Node.js** v18+ - Runtime de JavaScript
- **Express.js** v4 - Framework web minimalista
- **MySQL** v8+ - Sistema de gestión de base de datos relacional
- **mysql2** - Driver MySQL con soporte para promesas
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware para habilitar CORS

---

## ✅ Checklist de Implementación

### Punto 1: Servidor Express
- [x] Servidor Express creado
- [x] Archivos estáticos servidos desde /public
- [x] Endpoint raíz (GET /) devuelve index.html
- [x] Endpoint /health devuelve JSON con estado

### Punto 2: API de Contactos
- [x] API REST implementada
- [x] GET /api/contactos lista todos los contactos
- [x] POST /api/contactos crea nuevos contactos
- [x] Persistencia en MySQL funcionando

### Punto 3: Base de Datos
- [x] Base de datos `agrotrack` creada
- [x] Tabla `contactos` con campos: id, nombre, email, mensaje, fecha
- [x] Archivo schema.sql incluido

### Punto 4: Validaciones y Middleware
- [x] Validación de campos completados
- [x] Validación de formato de email
- [x] Errores 400 con mensajes descriptivos
- [x] Middleware de logger implementado
- [x] Middleware de error handler centralizado

### Punto 5: Variables de Entorno
- [x] dotenv configurado
- [x] Credenciales en archivo .env
- [x] .env incluido en .gitignore

---

## 🛠️ Troubleshooting

### Error: Cannot find module

```bash
npm install
```

### Error: Access denied for user

- Verificar credenciales en `.env`
- Verificar que MySQL esté corriendo:
  ```powershell
  # Windows
  Get-Service -Name *mysql*
  
  # Si no está corriendo
  Start-Service MySQL80
  ```

### Error: Unknown database 'agrotrack'

```bash
mysql -u root -p < database/schema.sql
```

### Puerto 3000 en uso

Cambiar `PORT` en `.env`:
```env
PORT=3001
```

O liberar el puerto:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Problemas con acentos/UTF-8

Verificar que:
1. Base de datos use charset `utf8mb4`
2. Archivo `config/database.js` tenga `charset: 'utf8mb4'`
3. Los archivos fuente estén guardados en UTF-8

---

## 📝 Notas Importantes

- **Seguridad:** En producción, implementar bcrypt para hashear contraseñas
- **CORS:** Actualmente permite todos los orígenes (`*`). En producción, especificar orígenes permitidos
- **Logs:** Los logs se muestran en consola. Para producción, considerar Winston o Morgan
- **Validaciones:** Las validaciones están en el lado del servidor. Considerar también validaciones en el frontend
- **Rate Limiting:** Considerar implementar limitación de peticiones en producción

---

## 👨‍💻 Alumno

**Zanetta, Augusto**

---

## 👨‍💻 Profesor

**Mari, Guillermo Andres**

---

## 📄 Licencia

ISC

---

## 🎓 Actividad Académica

Este proyecto fue desarrollado como parte de la Actividad Obligatoria Integradora 2 de la materia Programación Web 2.

**Fecha:** 12/11/2025  
**Versión:** 2.0