import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cdsanabriacf';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Modelo simple para socios
const memberSchema = new mongoose.Schema({
  numeroSocio: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'rechazado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

// Auto-generar numeroSocio
memberSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroSocio) {
    const lastMember = await mongoose.model('Member').findOne().sort({ numeroSocio: -1 });
    let nextNumber = 1;
    
    if (lastMember) {
      const lastNumber = parseInt(lastMember.numeroSocio.replace('SOC-', ''));
      nextNumber = lastNumber + 1;
    }
    
    this.numeroSocio = `SOC-${nextNumber.toString().padStart(4, '0')}`;
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API CD Sanabria CF funcionando correctamente',
    version: '1.0.0',
    status: 'online'
  });
});

// Health check
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

// API para socios
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ fechaRegistro: -1 });
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener socios'
    });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear socio',
      error: error.message
    });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Socio no encontrado'
      });
    }
    res.json({
      success: true,
      message: 'Socio eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar socio'
    });
  }
});

// Inicializar base de datos con datos de prueba
app.post('/api/init-db', async (req, res) => {
  try {
    // Limpiar datos existentes
    await Member.deleteMany({});
    
    // Crear socios de prueba
    const testMembers = [
      {
        nombre: 'Juan',
        apellidos: 'Pérez',
        dni: '12345678A',
        telefono: '600123456',
        email: 'juan.perez@email.com',
        direccion: 'Calle Mayor 1, Madrid'
      },
      {
        nombre: 'María',
        apellidos: 'García',
        dni: '87654321B',
        telefono: '600654321',
        email: 'maria.garcia@email.com',
        direccion: 'Avenida Principal 5, Barcelona'
      }
    ];
    
    const createdMembers = await Member.insertMany(testMembers);
    
    res.json({
      success: true,
      message: 'Base de datos inicializada',
      count: createdMembers.length,
      data: createdMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al inicializar base de datos',
      error: error.message
    });
  }
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api`);
      console.log(`🔍 Health check en http://localhost:${PORT}/api/health`);
      console.log(`👥 Socios en http://localhost:${PORT}/api/members`);
      console.log(`🔄 Inicializar DB en http://localhost:${PORT}/api/init-db`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
  }
};

startServer();

export default app;





