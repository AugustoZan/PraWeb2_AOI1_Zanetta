exports.checkHealth = (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    server: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};