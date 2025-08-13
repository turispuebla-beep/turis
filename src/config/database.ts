import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cdsanabriacf';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB conectado exitosamente');
    
    // Crear índices para optimizar consultas
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Índices para User
    await mongoose.model('User').createIndexes({ email: 1 });
    
    // Índices para Member
    await mongoose.model('Member').createIndexes({ numeroSocio: 1 });
    await mongoose.model('Member').createIndexes({ dni: 1 });
    await mongoose.model('Member').createIndexes({ estado: 1 });
    
    // Índices para Player
    await mongoose.model('Player').createIndexes({ dni: 1 });
    await mongoose.model('Player').createIndexes({ equipoId: 1 });
    await mongoose.model('Player').createIndexes({ dorsal: 1, equipoId: 1 });
    
    // Índices para Team
    await mongoose.model('Team').createIndexes({ categoria: 1 });
    
    // Índices para Event
    await mongoose.model('Event').createIndexes({ fecha: 1 });
    await mongoose.model('Event').createIndexes({ estado: 1 });
    
    // Índices para Media
    await mongoose.model('Media').createIndexes({ tipo: 1 });
    await mongoose.model('Media').createIndexes({ equipoId: 1 });
    
    console.log('✅ Índices de base de datos creados');
  } catch (error) {
    console.error('❌ Error creando índices:', error);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB desconectado');
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error);
  }
};

