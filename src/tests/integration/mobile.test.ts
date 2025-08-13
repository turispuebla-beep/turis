import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
import Team from '../../models/Team';
import Player from '../../models/Player';
import Member from '../../models/Member';
import Event from '../../models/Event';
import Media from '../../models/Media';
import path from 'path';
import fs from 'fs';

describe('Mobile API Endpoints', () => {
    let adminToken: string;
    let teamAdminToken: string;
    let testTeamId: string;
    let testUserId: string;
    let lastSyncTime: string;

    beforeAll(async () => {
        // Crear equipo de prueba
        const team = await Team.create({
            name: 'Equipo Test',
            category: 'prebenjamin',
            admin: {
                name: 'Admin Test',
                email: 'teamadmin@test.com',
                phone: '123456789'
            },
            contactInfo: {
                email: 'equipo@test.com',
                phone: '987654321'
            }
        });
        testTeamId = team._id.toString();

        // Crear usuario de prueba
        const user = await User.create({
            email: 'teamadmin@test.com',
            password: 'password123',
            name: 'Team Admin',
            role: 'teamAdmin',
            teamId: testTeamId
        });
        testUserId = user._id.toString();

        // Obtener tokens
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'amco@gmx.es',
                password: '533712'
            });
        adminToken = adminLogin.body.token;

        const teamAdminLogin = await request(app)
            .post('/api/v1/mobile/auth/login')
            .send({
                email: 'teamadmin@test.com',
                password: 'password123',
                deviceToken: 'test-fcm-token'
            });
        teamAdminToken = teamAdminLogin.body.token;

        lastSyncTime = new Date().toISOString();
    });

    describe('Mobile Authentication', () => {
        it('debe permitir login con token de dispositivo', async () => {
            const response = await request(app)
                .post('/api/v1/mobile/auth/login')
                .send({
                    email: 'teamadmin@test.com',
                    password: 'password123',
                    deviceToken: 'new-fcm-token'
                });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
            expect(response.body.user).toBeDefined();
            expect(response.body.expiresIn).toBeDefined();
        });

        it('debe actualizar token de dispositivo', async () => {
            const response = await request(app)
                .put('/api/v1/mobile/auth/device-token')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    deviceToken: 'updated-fcm-token'
                });

            expect(response.status).toBe(200);

            const user = await User.findById(testUserId);
            expect(user?.deviceToken).toBe('updated-fcm-token');
        });
    });

    describe('Data Synchronization', () => {
        beforeEach(async () => {
            // Crear datos de prueba para sincronización
            await Player.create({
                name: 'Jugador Test',
                surname: 'Apellido Test',
                dni: '12345678A',
                phone: '123456789',
                birthDate: '2010-01-01',
                teamId: testTeamId,
                gender: 'masculino',
                guardianInfo: [{
                    name: 'Tutor Test',
                    dni: '87654321B',
                    phone: '987654321',
                    email: 'tutor@test.com',
                    relation: 'padre'
                }]
            });

            await Member.create({
                name: 'Socio Test',
                surname: 'Apellido Test',
                dni: '23456789B',
                phone: '234567890',
                email: 'socio@test.com',
                gender: 'femenino',
                teamId: testTeamId,
                status: 'active',
                memberNumber: 1
            });

            await Event.create({
                title: 'Evento Test',
                description: 'Descripción test',
                date: new Date(),
                price: 10,
                location: 'Ubicación test',
                teamId: testTeamId,
                minParticipants: 5,
                maxParticipants: 20
            });
        });

        it('debe sincronizar datos incrementalmente', async () => {
            const response = await request(app)
                .get('/api/v1/mobile/sync')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .set('Last-Sync-Time', lastSyncTime);

            expect(response.status).toBe(200);
            expect(response.body.data.updates).toBeDefined();
            expect(response.body.data.deletions).toBeDefined();
            expect(response.body.data.syncTime).toBeDefined();

            // Verificar estructura de datos
            expect(response.body.data.updates.players).toBeDefined();
            expect(response.body.data.updates.members).toBeDefined();
            expect(response.body.data.updates.events).toBeDefined();
        });

        it('debe filtrar datos por equipo para admin de equipo', async () => {
            // Crear otro equipo con datos
            const otherTeam = await Team.create({
                name: 'Otro Equipo',
                category: 'benjamin'
            });

            await Player.create({
                name: 'Otro Jugador',
                surname: 'Apellido',
                dni: '34567890C',
                phone: '345678901',
                birthDate: '2010-01-01',
                teamId: otherTeam._id,
                gender: 'masculino'
            });

            const response = await request(app)
                .get('/api/v1/mobile/sync')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .set('Last-Sync-Time', lastSyncTime);

            expect(response.status).toBe(200);
            expect(response.body.data.updates.players.every((p: any) => 
                p.teamId.toString() === testTeamId
            )).toBe(true);
        });
    });

    describe('Media Optimization', () => {
        let testMediaId: string;

        beforeAll(async () => {
            // Crear archivo de prueba
            const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
            if (!fs.existsSync(testImagePath)) {
                // Crear imagen de prueba si no existe
                const imageBuffer = Buffer.alloc(100 * 100 * 3); // 100x100 RGB
                fs.writeFileSync(testImagePath, imageBuffer);
            }

            // Crear registro de media
            const media = await Media.create({
                type: 'photo',
                url: testImagePath,
                description: 'Test photo',
                teamId: testTeamId
            });
            testMediaId = media._id.toString();
        });

        it('debe optimizar imagen según dimensiones del dispositivo', async () => {
            const response = await request(app)
                .get(`/api/v1/mobile/media/${testMediaId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .set('Device-Width', '1080')
                .set('Device-DPI', '440');

            expect(response.status).toBe(200);
            expect(response.type).toBe('image/jpeg');
            
            // Verificar que la imagen fue redimensionada
            const buffer = response.body;
            expect(buffer.length).toBeLessThan(100 * 100 * 3); // Debe ser menor que la original
        });

        it('debe manejar diferentes densidades de pantalla', async () => {
            const response = await request(app)
                .get(`/api/v1/mobile/media/${testMediaId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .set('Device-Width', '1440')
                .set('Device-DPI', '560');

            expect(response.status).toBe(200);
            expect(response.type).toBe('image/jpeg');
        });

        it('debe validar permisos de acceso a media', async () => {
            // Crear otro equipo y media
            const otherTeam = await Team.create({
                name: 'Otro Equipo',
                category: 'benjamin'
            });

            const otherMedia = await Media.create({
                type: 'photo',
                url: '/test/path',
                description: 'Other team photo',
                teamId: otherTeam._id
            });

            const response = await request(app)
                .get(`/api/v1/mobile/media/${otherMedia._id}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .set('Device-Width', '1080')
                .set('Device-DPI', '440');

            expect(response.status).toBe(403);
        });
    });

    describe('Error Handling', () => {
        it('debe manejar token inválido', async () => {
            const response = await request(app)
                .get('/api/v1/mobile/sync')
                .set('Authorization', 'Bearer invalid-token')
                .set('Last-Sync-Time', lastSyncTime);

            expect(response.status).toBe(401);
        });

        it('debe manejar fecha de sincronización inválida', async () => {
            const response = await request(app)
                .get('/api/v1/mobile/sync')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .set('Last-Sync-Time', 'invalid-date');

            expect(response.status).toBe(400);
        });

        it('debe manejar parámetros de dispositivo faltantes', async () => {
            const response = await request(app)
                .get(`/api/v1/mobile/media/${testMediaId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(400);
        });
    });
});