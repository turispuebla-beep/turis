import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno para pruebas
dotenv.config({ path: '.env.test' });

// Configurar tiempo de espera global para pruebas
jest.setTimeout(30000);

// Conectar a la base de datos de pruebas
beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/futbol-web-test');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
});

// Limpiar la base de datos después de cada prueba
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
    await mongoose.connection.close();
});