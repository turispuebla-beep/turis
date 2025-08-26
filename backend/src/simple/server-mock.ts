import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos simulados en memoria
let members = [
  {
    id: '1',
    numeroSocio: 'SOC-0001',
    nombre: 'Juan',
    apellidos: 'Pérez',
    dni: '12345678A',
    telefono: '600123456',
    email: 'juan.perez@email.com',
    direccion: 'Calle Mayor 1, Madrid',
    fechaRegistro: new Date('2024-01-15'),
    estado: 'confirmado'
  },
  {
    id: '2',
    numeroSocio: 'SOC-0002',
    nombre: 'María',
    apellidos: 'García',
    dni: '87654321B',
    telefono: '600654321',
    email: 'maria.garcia@email.com',
    direccion: 'Avenida Principal 5, Barcelona',
    fechaRegistro: new Date('2024-01-20'),
    estado: 'pendiente'
  }
];

let nextId = 3;
let nextSocioNumber = 3;

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API CD Sanabria CF funcionando correctamente',
    version: '1.0.0',
    status: 'online',
    note: 'Usando datos simulados (sin MongoDB)'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'mock (simulado)',
    timestamp: new Date().toISOString()
  });
});

// API para socios
app.get('/api/members', (req, res) => {
  res.json({
    success: true,
    count: members.length,
    data: members
  });
});

app.post('/api/members', (req, res) => {
  try {
    const { nombre, apellidos, dni, telefono, email, direccion } = req.body;
    
    // Validaciones básicas
    if (!nombre || !apellidos || !dni || !telefono || !email || !direccion) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }
    
    // Verificar DNI único
    if (members.find(m => m.dni === dni)) {
      return res.status(400).json({
        success: false,
        message: 'El DNI ya está registrado'
      });
    }
    
    const newMember = {
      id: nextId.toString(),
      numeroSocio: `SOC-${nextSocioNumber.toString().padStart(4, '0')}`,
      nombre,
      apellidos,
      dni,
      telefono,
      email,
      direccion,
      fechaRegistro: new Date(),
      estado: 'pendiente'
    };
    
    members.push(newMember);
    nextId++;
    nextSocioNumber++;
    
    res.status(201).json({
      success: true,
      data: newMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear socio'
    });
  }
});

app.delete('/api/members/:id', (req, res) => {
  const memberIndex = members.findIndex(m => m.id === req.params.id);
  
  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Socio no encontrado'
    });
  }
  
  members.splice(memberIndex, 1);
  
  res.json({
    success: true,
    message: 'Socio eliminado correctamente'
  });
});

// Inicializar base de datos con datos de prueba
app.post('/api/init-db', (req, res) => {
  // Resetear datos
  members = [
    {
      id: '1',
      numeroSocio: 'SOC-0001',
      nombre: 'Juan',
      apellidos: 'Pérez',
      dni: '12345678A',
      telefono: '600123456',
      email: 'juan.perez@email.com',
      direccion: 'Calle Mayor 1, Madrid',
      fechaRegistro: new Date('2024-01-15'),
      estado: 'confirmado'
    },
    {
      id: '2',
      numeroSocio: 'SOC-0002',
      nombre: 'María',
      apellidos: 'García',
      dni: '87654321B',
      telefono: '600654321',
      email: 'maria.garcia@email.com',
      direccion: 'Avenida Principal 5, Barcelona',
      fechaRegistro: new Date('2024-01-20'),
      estado: 'pendiente'
    }
  ];
  
  nextId = 3;
  nextSocioNumber = 3;
  
  res.json({
    success: true,
    message: 'Base de datos inicializada con datos de prueba',
    count: members.length,
    data: members
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔍 Health check en http://localhost:${PORT}/api/health`);
  console.log(`👥 Socios en http://localhost:${PORT}/api/members`);
  console.log(`🔄 Inicializar DB en http://localhost:${PORT}/api/init-db`);
  console.log(`📝 NOTA: Usando datos simulados (sin MongoDB)`);
});

export default app;




