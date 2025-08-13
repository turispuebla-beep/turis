import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API CD Sanabria CF funcionando correctamente',
    version: '1.0.0',
    status: 'online'
  });
});

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/api/health', async (req, res) => {
  try {
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error de conexión a la base de datos'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔍 Health check en http://localhost:${PORT}/api/health`);
});

export default app;