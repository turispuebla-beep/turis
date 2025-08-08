import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

describe('Auth Endpoints', () => {
    beforeEach(async () => {
        // Limpiar la base de datos antes de cada prueba
        await User.deleteMany({});
    });

    describe('POST /api/auth/login', () => {
        it('debe autenticar al administrador/a principal correctamente', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'amco@gmx.es',
                    password: '533712'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.data.role).toBe('admin');
        });

        it('debe rechazar credenciales inválidas', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/auth/register', () => {
        it('debe permitir al admin crear administrador/a de equipo', async () => {
            // Primero login como admin
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'amco@gmx.es',
                    password: '533712'
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .post('/api/auth/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    email: 'teamadmin@test.com',
                    password: 'password123',
                    name: 'Team Admin',
                    role: 'teamAdmin',
                    teamId: '123456789012'
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('email', 'teamadmin@test.com');
            expect(response.body.data.role).toBe('teamAdmin');
        });

        it('debe impedir registro sin autenticación', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    name: 'Test User',
                    role: 'teamAdmin'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        it('debe devolver el perfil del usuario autenticado', async () => {
            // Primero login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'amco@gmx.es',
                    password: '533712'
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('email', 'amco@gmx.es');
            expect(response.body.data.role).toBe('admin');
        });

        it('debe rechazar acceso sin token', async () => {
            const response = await request(app)
                .get('/api/auth/me');

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/auth/updatepassword', () => {
        it('debe permitir actualizar contraseña', async () => {
            // Primero login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'amco@gmx.es',
                    password: '533712'
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .put('/api/auth/updatepassword')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: '533712',
                    newPassword: 'newpassword123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');

            // Verificar que podemos hacer login con la nueva contraseña
            const newLoginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'amco@gmx.es',
                    password: 'newpassword123'
                });

            expect(newLoginResponse.status).toBe(200);
        });

        it('debe rechazar contraseña actual incorrecta', async () => {
            // Primero login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'amco@gmx.es',
                    password: '533712'
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .put('/api/auth/updatepassword')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    currentPassword: 'wrongpassword',
                    newPassword: 'newpassword123'
                });

            expect(response.status).toBe(401);
        });
    });
});