import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Member } from '../models/Member';
import { Friend } from '../models/Friend';
import { Player } from '../models/Player';
import { Event } from '../models/Event';
import { Media } from '../models/Media';
import { Document } from '../models/Document';
import bcrypt from 'bcryptjs';

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🚀 Inicializando base de datos...');
    
    // Conectar a MongoDB
    await connectDB();
    
    // Limpiar datos existentes
    await clearExistingData();
    
    // Crear equipos por defecto
    const teams = await createDefaultTeams();
    
    // Crear administradores por defecto
    await createDefaultAdmins(teams);
    
    console.log('✅ Base de datos inicializada exitosamente');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    await disconnectDB();
  }
};

const clearExistingData = async (): Promise<void> => {
  console.log('🧹 Limpiando datos existentes...');
  
  await User.deleteMany({});
  await Team.deleteMany({});
  await Member.deleteMany({});
  await Friend.deleteMany({});
  await Player.deleteMany({});
  await Event.deleteMany({});
  await Media.deleteMany({});
  await Document.deleteMany({});
  
  console.log('✅ Datos existentes eliminados');
};

const createDefaultTeams = async (): Promise<any[]> => {
  console.log('⚽ Creando equipos por defecto...');
  
  const defaultTeams = [
    {
      nombre: 'Prebenjamín',
      categoria: 'Prebenjamín',
      descripcion: 'Equipo Prebenjamín del CD Sanabria CF',
      colorPrincipal: '#1e40af',
      colorSecundario: '#ffffff'
    },
    {
      nombre: 'Benjamín',
      categoria: 'Benjamín',
      descripcion: 'Equipo Benjamín del CD Sanabria CF',
      colorPrincipal: '#1e40af',
      colorSecundario: '#ffffff'
    },
    {
      nombre: 'Alevín',
      categoria: 'Alevín',
      descripcion: 'Equipo Alevín del CD Sanabria CF',
      colorPrincipal: '#1e40af',
      colorSecundario: '#ffffff'
    },
    {
      nombre: 'Infantil',
      categoria: 'Infantil',
      descripcion: 'Equipo Infantil del CD Sanabria CF',
      colorPrincipal: '#1e40af',
      colorSecundario: '#ffffff'
    },
    {
      nombre: 'Aficionado',
      categoria: 'Aficionado',
      descripcion: 'Equipo Aficionado del CD Sanabria CF',
      colorPrincipal: '#1e40af',
      colorSecundario: '#ffffff'
    }
  ];
  
  const createdTeams = await Team.insertMany(defaultTeams);
  console.log(`✅ ${createdTeams.length} equipos creados`);
  
  return createdTeams;
};

const createDefaultAdmins = async (teams: any[]): Promise<void> => {
  console.log('👤 Creando administradores por defecto...');
  
  // Administrador único (super admin)
  const superAdmin = new User({
    email: 'amco@gmx.es',
    password: '533712',
    nombre: 'Administrador',
    apellidos: 'General',
    role: 'super_admin',
    isActive: true
  });
  
  await superAdmin.save();
  
  // Administrador de equipo (usando el primer equipo como ejemplo)
  const teamAdmin = new User({
    email: 'cdsanabriacf@gmail.com',
    password: 'admin123',
    nombre: 'Administrador',
    apellidos: 'Equipo',
    role: 'team_admin',
    equipoId: teams[0]._id,
    isActive: true
  });
  
  await teamAdmin.save();
  
  console.log('✅ Administradores por defecto creados');
  console.log('📧 Super Admin: amco@gmx.es / 533712');
  console.log('📧 Team Admin: cdsanabriacf@gmail.com / admin123');
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Inicialización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en inicialización:', error);
      process.exit(1);
    });
}

export { initializeDatabase };



