const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Variables de entorno
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cdsanabriacf_jwt_secret_2024';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'amco@gmx.es';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '533712';

// Datos simulados en memoria
let members = [
  {
    id: 1,
    numeroSocio: 'SOC-0001',
    nombre: 'Juan',
    apellidos: 'Pérez',
    dni: '12345678A',
    telefono: '600000001',
    email: 'juan.perez@example.com',
    direccion: 'Calle Principal 1, Puebla de Sanabria',
    estado: 'Activo',
    fechaRegistro: new Date().toISOString()
  },
  {
    id: 2,
    numeroSocio: 'SOC-0002',
    nombre: 'María',
    apellidos: 'García',
    dni: '87654321B',
    telefono: '600000002',
    email: 'maria.garcia@example.com',
    direccion: 'Calle Secundaria 2, Puebla de Sanabria',
    estado: 'Activo',
    fechaRegistro: new Date().toISOString()
  }
];

let equipos = [
  { id: 1, nombre: 'Prebenjamín', categoria: 'prebenjamin', descripcion: 'Equipo prebenjamín' },
  { id: 2, nombre: 'Benjamín', categoria: 'benjamin', descripcion: 'Equipo benjamín' },
  { id: 3, nombre: 'Alevín', categoria: 'alevin', descripcion: 'Equipo alevín' },
  { id: 4, nombre: 'Infantil', categoria: 'infantil', descripcion: 'Equipo infantil' },
  { id: 5, nombre: 'Aficionado', categoria: 'aficionado', descripcion: 'Equipo aficionado' }
];

let jugadores = [];
let eventos = [];
let amigos = [];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });

  // Emitir datos iniciales
  socket.emit('data-sync', {
    members,
    equipos,
    jugadores,
    eventos,
    amigos
  });
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'mock (simulado)',
    websocket: 'active',
    timestamp: new Date().toISOString(),
    stats: {
      members: members.length,
      equipos: equipos.length,
      jugadores: jugadores.length,
      eventos: eventos.length,
      amigos: amigos.length
    }
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      success: true,
      token,
      user: { email, role: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Members API
app.get('/api/members', (req, res) => {
  res.json({ success: true, data: members });
});

app.post('/api/members', (req, res) => {
  const newMember = {
    id: Date.now(),
    numeroSocio: `SOC-${String(members.length + 1).padStart(4, '0')}`,
    ...req.body,
    estado: 'Activo',
    fechaRegistro: new Date().toISOString()
  };
  
  members.push(newMember);
  
  // Emitir evento WebSocket
  io.emit('member-added', newMember);
  
  res.json({ success: true, data: newMember });
});

app.put('/api/members/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = members.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Socio no encontrado' });
  }
  
  members[index] = { ...members[index], ...req.body };
  
  // Emitir evento WebSocket
  io.emit('member-changed', members[index]);
  
  res.json({ success: true, data: members[index] });
});

app.delete('/api/members/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = members.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Socio no encontrado' });
  }
  
  members.splice(index, 1);
  
  // Emitir evento WebSocket
  io.emit('member-deleted', { id });
  
  res.json({ success: true, message: 'Socio eliminado' });
});

// Equipos API
app.get('/api/equipos', (req, res) => {
  res.json({ success: true, data: equipos });
});

app.post('/api/equipos', (req, res) => {
  const newEquipo = {
    id: Date.now(),
    ...req.body
  };
  
  equipos.push(newEquipo);
  
  // Emitir evento WebSocket
  io.emit('team-added', newEquipo);
  
  res.json({ success: true, data: newEquipo });
});

// Jugadores API
app.get('/api/jugadores', (req, res) => {
  res.json({ success: true, data: jugadores });
});

app.post('/api/jugadores', (req, res) => {
  const newJugador = {
    id: Date.now(),
    ...req.body
  };
  
  jugadores.push(newJugador);
  
  // Emitir evento WebSocket
  io.emit('player-added', newJugador);
  
  res.json({ success: true, data: newJugador });
});

// Eventos API
app.get('/api/eventos', (req, res) => {
  res.json({ success: true, data: eventos });
});

app.post('/api/eventos', (req, res) => {
  const newEvento = {
    id: Date.now(),
    ...req.body
  };
  
  eventos.push(newEvento);
  
  // Emitir evento WebSocket
  io.emit('event-added', newEvento);
  
  res.json({ success: true, data: newEvento });
});

// Amigos API
app.get('/api/amigos', (req, res) => {
  res.json({ success: true, data: amigos });
});

app.post('/api/amigos', (req, res) => {
  const newAmigo = {
    id: Date.now(),
    ...req.body
  };
  
  amigos.push(newAmigo);
  
  // Emitir evento WebSocket
  io.emit('friend-added', newAmigo);
  
  res.json({ success: true, data: newAmigo });
});

// Sync endpoint
app.post('/api/sync', (req, res) => {
  const { data } = req.body;
  
  if (data.members) members = data.members;
  if (data.equipos) equipos = data.equipos;
  if (data.jugadores) jugadores = data.jugadores;
  if (data.eventos) eventos = data.eventos;
  if (data.amigos) amigos = data.amigos;
  
  // Emitir sincronización a todos los clientes
  io.emit('data-sync', { members, equipos, jugadores, eventos, amigos });
  
  res.json({ success: true, message: 'Datos sincronizados' });
});

// Inicializar base de datos
app.post('/api/init-db', (req, res) => {
  // Resetear datos a valores por defecto
  members = [
    {
      id: 1,
      numeroSocio: 'SOC-0001',
      nombre: 'Juan',
      apellidos: 'Pérez',
      dni: '12345678A',
      telefono: '600000001',
      email: 'juan.perez@example.com',
      direccion: 'Calle Principal 1, Puebla de Sanabria',
      estado: 'Activo',
      fechaRegistro: new Date().toISOString()
    },
    {
      id: 2,
      numeroSocio: 'SOC-0002',
      nombre: 'María',
      apellidos: 'García',
      dni: '87654321B',
      telefono: '600000002',
      email: 'maria.garcia@example.com',
      direccion: 'Calle Secundaria 2, Puebla de Sanabria',
      estado: 'Activo',
      fechaRegistro: new Date().toISOString()
    }
  ];
  
  equipos = [
    { id: 1, nombre: 'Prebenjamín', categoria: 'prebenjamin', descripcion: 'Equipo prebenjamín' },
    { id: 2, nombre: 'Benjamín', categoria: 'benjamin', descripcion: 'Equipo benjamín' },
    { id: 3, nombre: 'Alevín', categoria: 'alevin', descripcion: 'Equipo alevín' },
    { id: 4, nombre: 'Infantil', categoria: 'infantil', descripcion: 'Equipo infantil' },
    { id: 5, nombre: 'Aficionado', categoria: 'aficionado', descripcion: 'Equipo aficionado' }
  ];
  
  jugadores = [];
  eventos = [];
  amigos = [];
  
  // Emitir sincronización
  io.emit('data-sync', { members, equipos, jugadores, eventos, amigos });
  
  res.json({ 
    success: true, 
    message: 'Base de datos inicializada',
    stats: {
      members: members.length,
      equipos: equipos.length,
      jugadores: jugadores.length,
      eventos: eventos.length,
      amigos: amigos.length
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CD Sanabria CF API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      members: '/api/members',
      equipos: '/api/equipos',
      jugadores: '/api/jugadores',
      eventos: '/api/eventos',
      amigos: '/api/amigos',
      auth: '/api/auth/login',
      sync: '/api/sync',
      init: '/api/init-db'
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Servidor CD Sanabria CF iniciado en puerto ${PORT}`);
  console.log(`📡 WebSocket activo`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Socios iniciales: ${members.length}`);
  console.log(`⚽ Equipos: ${equipos.length}`);
});

module.exports = app;




