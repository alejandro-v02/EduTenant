export default () => ({
  puerto: parseInt(process.env.PUERTO ?? '3000', 10),
  baseDeDatos: {
    host: process.env.DB_HOST ?? 'localhost',
    puerto: parseInt(process.env.DB_PUERTO ?? '5432', 10),
    usuario: process.env.DB_USUARIO ?? 'edutenant',
    clave: process.env.DB_CLAVE ?? 'edutenant',
    nombre: process.env.DB_NOMBRE ?? 'edutenant',
  },
  jwt: {
    secreto: process.env.JWT_SECRETO ?? 'secreto-inseguro-cambiar',
    expiracion: process.env.JWT_EXPIRACION ?? '8h',
  },
  superadmin: {
    email: process.env.SUPERADMIN_EMAIL,
    clave: process.env.SUPERADMIN_CLAVE,
  },
  correo: {
    apiKey: process.env.RESEND_API_KEY,
    remitente: process.env.EMAIL_REMITENTE ?? 'Skolar <onboarding@resend.dev>',
    urlFrontend: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  },
});
