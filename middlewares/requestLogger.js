function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  // Log de la petición entrante
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📥 [${timestamp}]`);
  console.log(`   Método: ${method}`);
  console.log(`   URL: ${url}`);
  console.log(`   IP: ${ip}`);
  console.log(`   User-Agent: ${req.get('user-agent') || 'No especificado'}`);
  
  // Log del body si es POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    console.log(`   Body:`, JSON.stringify(req.body, null, 2));
  }

  // Capturar el inicio del tiempo de respuesta
  const startTime = Date.now();

  // Se registra cuando termina la respuesta
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Se ua un emoji dependiendo del status code
    let statusEmoji = '✅';
    if (statusCode >= 400 && statusCode < 500) statusEmoji = '⚠️';
    if (statusCode >= 500) statusEmoji = '❌';

    console.log(`📤 [${timestamp}]`);
    console.log(`   ${statusEmoji} Status: ${statusCode}`);
    console.log(`   ⏱️  Duración: ${duration}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  next();
}

module.exports = { requestLogger };