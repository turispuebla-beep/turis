import request from 'supertest';
import app from '../../app';
import Media from '../../models/Media';
import Team from '../../models/Team';
import User from '../../models/User';
import path from 'path';
import fs from 'fs';

describe('Media Endpoints', () => {
    let adminToken: string;
    let teamAdminToken: string;
    let testTeamId: string;
    let testPhotoId: string;
    let testVideoId: string;

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

        // Obtener token de admin principal
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'amco@gmx.es',
                password: '533712'
            });
        adminToken = adminLogin.body.token;

        // Crear y obtener token de admin de equipo
        await User.create({
            email: 'teamadmin@test.com',
            password: 'password123',
            name: 'Team Admin',
            role: 'teamAdmin',
            teamId: testTeamId
        });

        const teamAdminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teamadmin@test.com',
                password: 'password123'
            });
        teamAdminToken = teamAdminLogin.body.token;

        // Crear foto y video de prueba
        const photo = await Media.create({
            type: 'photo',
            url: '/uploads/test-photo.jpg',
            description: 'Foto de prueba',
            teamId: testTeamId
        });
        testPhotoId = photo._id.toString();

        const video = await Media.create({
            type: 'video',
            url: '/uploads/test-video.mp4',
            description: 'Video de prueba',
            teamId: testTeamId
        });
        testVideoId = video._id.toString();
    });

    beforeEach(async () => {
        // Limpiar medios excepto los de prueba
        await Media.deleteMany({
            _id: { $nin: [testPhotoId, testVideoId] }
        });
    });

    describe('GET /api/teams/:teamId/media', () => {
        it('debe permitir ver fotos y videos públicamente', async () => {
            const response = await request(app)
                .get(`/api/teams/${testTeamId}/media`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('debe filtrar por tipo de medio', async () => {
            const response = await request(app)
                .get(`/api/teams/${testTeamId}/media?type=photo`);

            expect(response.status).toBe(200);
            expect(response.body.data.every((m: any) => m.type === 'photo')).toBe(true);
        });
    });

    describe('POST /api/teams/:teamId/media/photos', () => {
        it('debe permitir subir foto', async () => {
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/media/photos`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .field('description', 'Nueva foto')
                .attach('photo', path.join(__dirname, '../fixtures/test-photo.jpg'));

            expect(response.status).toBe(201);
            expect(response.body.data.type).toBe('photo');
            expect(response.body.data.url).toBeDefined();
        });

        it('debe validar tipo de archivo para fotos', async () => {
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/media/photos`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .field('description', 'Archivo inválido')
                .attach('photo', path.join(__dirname, '../fixtures/test.txt'));

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('tipo de archivo');
        });
    });

    describe('POST /api/teams/:teamId/media/videos', () => {
        it('debe permitir subir video', async () => {
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/media/videos`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .field('description', 'Nuevo video')
                .attach('video', path.join(__dirname, '../fixtures/test-video.mp4'));

            expect(response.status).toBe(201);
            expect(response.body.data.type).toBe('video');
            expect(response.body.data.url).toBeDefined();
        });

        it('debe validar tipo de archivo para videos', async () => {
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/media/videos`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .field('description', 'Archivo inválido')
                .attach('video', path.join(__dirname, '../fixtures/test.txt'));

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('tipo de archivo');
        });

        it('debe validar tamaño máximo de video', async () => {
            // Crear un archivo de video grande (más de 100MB)
            const tempVideoPath = path.join(__dirname, '../fixtures/large-video.mp4');
            const writeStream = fs.createWriteStream(tempVideoPath);
            const bufferSize = 1024 * 1024; // 1MB
            const buffer = Buffer.alloc(bufferSize).fill('0');
            
            for (let i = 0; i < 101; i++) { // Escribir 101MB
                writeStream.write(buffer);
            }
            writeStream.end();

            const response = await request(app)
                .post(`/api/teams/${testTeamId}/media/videos`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .field('description', 'Video grande')
                .attach('video', tempVideoPath);

            // Limpiar archivo temporal
            fs.unlinkSync(tempVideoPath);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('tamaño');
        });
    });

    describe('PUT /api/teams/:teamId/media/:id', () => {
        it('debe permitir actualizar descripción de foto', async () => {
            const response = await request(app)
                .put(`/api/teams/${testTeamId}/media/${testPhotoId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ description: 'Descripción actualizada' });

            expect(response.status).toBe(200);
            expect(response.body.data.description).toBe('Descripción actualizada');
        });
    });

    describe('DELETE /api/teams/:teamId/media/:id', () => {
        it('debe permitir eliminar foto', async () => {
            const response = await request(app)
                .delete(`/api/teams/${testTeamId}/media/${testPhotoId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(200);

            const deletedPhoto = await Media.findById(testPhotoId);
            expect(deletedPhoto).toBeNull();
        });

        it('debe eliminar archivo físico al eliminar medio', async () => {
            // Crear archivo temporal
            const tempFilePath = path.join(__dirname, '../../uploads/test-delete.jpg');
            fs.writeFileSync(tempFilePath, 'test');

            // Crear registro de medio
            const media = await Media.create({
                type: 'photo',
                url: '/uploads/test-delete.jpg',
                description: 'Para eliminar',
                teamId: testTeamId
            });

            const response = await request(app)
                .delete(`/api/teams/${testTeamId}/media/${media._id}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(200);
            expect(fs.existsSync(tempFilePath)).toBe(false);
        });

        it('debe impedir eliminar medio de otro equipo', async () => {
            const otherTeam = await Team.create({
                name: 'Otro Equipo',
                category: 'benjamin',
                admin: {
                    name: 'Otro Admin',
                    email: 'otro@test.com',
                    phone: '123456789'
                },
                contactInfo: {
                    email: 'otro@test.com',
                    phone: '987654321'
                }
            });

            const otherMedia = await Media.create({
                type: 'photo',
                url: '/uploads/other-test.jpg',
                description: 'Foto de otro equipo',
                teamId: otherTeam._id
            });

            const response = await request(app)
                .delete(`/api/teams/${otherTeam._id}/media/${otherMedia._id}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(403);
        });
    });
});