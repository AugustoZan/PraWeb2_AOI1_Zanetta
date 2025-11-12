// Utilidades para parsear body de peticiones POST

// Parsear datos POST genéricos (form-urlencoded)
function parsePostData(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    
    req.on('data', chunk => {
      cuerpo += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parametros = new URLSearchParams(cuerpo);
        const params = {};
        
        for (const [clave, valor] of parametros) {
          params[clave] = valor;
        }
        
        resolve(params);
      } catch (err) {
        reject(err);
      }
    });
    
    req.on('error', reject);
  });
}

// Parsear datos de autenticación
function parseAuthData(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    
    req.on('data', chunk => {
      cuerpo += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parametros = new URLSearchParams(cuerpo);
        const usuario = parametros.get('usuario');
        const clave = parametros.get('clave');
        
        resolve({ usuario, clave });
      } catch (err) {
        reject(err);
      }
    });
    
    req.on('error', reject);
  });
}

module.exports = {
  parsePostData,
  parseAuthData
};