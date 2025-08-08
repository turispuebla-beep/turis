import request from 'supertest';
import app from '../../app';
import Event from '../../models/Event';
import Team from '../../models/Team';
import User from '../../models/User';
import Member from '../../models/Member';
import mongoose from 'mongoose';
import path from 'path';

describe('Event Endpoints', () => {
    let adminToken: string;
    let teamAdminToken: string;
    let testTeamId: string;
    let testEventId: string;
    let testMemberId: string;

    const validEventData = {
        title: 'Evento Test',
        description: 'Descripción del evento test',
        date: new Date().toISOString(),
        price: 10.00,
        minParticipants: 5,
        maxParticipants: 20,
        photoConsent: true,
        location: 'Ubicación Test'
    };

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

        // Crear socio/a activo para pruebas
        const member = await Member.create({
            name: 'Socio Test',
            surname: 'Apellido Test',
            dni: '12345678A',
            phone: '123456789',
            email: 'socio@test.com',
            gender: 'masculino',
            teamId: testTeamId,
            status: 'active',
            memberNumber: 1
        });
        testMemberId = member._id.toString();

        // Crear evento de prueba
        const event = await Event.create({
            ...validEventData,
            teamId: testTeamId,
            participants: []
        });
        testEventId = event._id.toString();
    });

    beforeEach(async () => {
        // Limpiar eventos excepto el de prueba
        await Event.deleteMany({ _id: { $ne: testEventId } });
    });

    describe('GET /api/teams/:teamId/events', () => {
        it('debe permitir ver eventos públicamente', async () => {
            const response = await request(app)
                .get(`/api/teams/${testTeamId}/events`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('debe filtrar eventos por fecha', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);

            await Event.create({
                ...validEventData,
                teamId: testTeamId,
                date: futureDate,
                title: 'Evento Futuro'
            });

            const response = await request(app)
                .get(`/api/teams/${testTeamId}/events?upcoming=true`);

            expect(response.status).toBe(200);
            expect(response.body.data.some((e: any) => e.title === 'Evento Futuro')).toBe(true);
        });
    });

    describe('POST /api/teams/:teamId/events', () => {
        it('debe permitir crear evento con imagen', async () => {
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/events`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .field('title', 'Evento con Imagen')
                .field('description', 'Descripción del evento')
                .field('date', new Date().toISOString())
                .field('price', '15.00')
                .field('minParticipants', '3')
                .field('maxParticipants', '10')
                .field('photoConsent', 'true')
                .field('location', 'Ubicación Test')
                .attach('image', path.join(__dirname, '../fixtures/test-image.jpg'));

            expect(response.status).toBe(201);
            expect(response.body.data.image).toBeDefined();
        });

        it('debe validar límites de participantes', async () => {
            const invalidEvent = {
                ...validEventData,
                minParticipants: 20,
                maxParticipants: 10
            };

            const response = await request(app)
                .post(`/api/teams/${testTeamId}/events`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(invalidEvent);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('participantes');
        });
    });

    describe('POST /api/teams/:teamId/events/:id/register', () => {
        it('debe permitir inscripción de socio/a activo', async () => {
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/events/${testEventId}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            expect(response.status).toBe(200);
            expect(response.body.data.participants).toContain(testMemberId);
        });

        it('debe impedir inscripción si el evento está lleno', async () => {
            const fullEvent = await Event.create({
                ...validEventData,
                teamId: testTeamId,
                maxParticipants: 1,
                participants: [new mongoose.Types.ObjectId()]
            });

            const response = await request(app)
                .post(`/api/teams/${testTeamId}/events/${fullEvent._id}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('lleno');
        });

        it('debe impedir inscripción duplicada', async () => {
            // Primero inscribimos al socio
            await request(app)
                .post(`/api/teams/${testTeamId}/events/${testEventId}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            // Intentamos inscribir de nuevo
            const response = await request(app)
                .post(`/api/teams/${testTeamId}/events/${testEventId}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('ya inscrito');
        });
    });

    describe('DELETE /api/teams/:teamId/events/:id/register', () => {
        it('debe permitir cancelar inscripción', async () => {
            // Primero inscribimos al socio
            await request(app)
                .post(`/api/teams/${testTeamId}/events/${testEventId}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            // Luego cancelamos la inscripción
            const response = await request(app)
                .delete(`/api/teams/${testTeamId}/events/${testEventId}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            expect(response.status).toBe(200);
            expect(response.body.data.participants).not.toContain(testMemberId);
        });
    });

    describe('PUT /api/teams/:teamId/events/:id', () => {
        it('debe permitir actualizar detalles del evento', async () => {
            const update = {
                title: 'Título Actualizado',
                price: 25.00
            };

            const response = await request(app)
                .put(`/api/teams/${testTeamId}/events/${testEventId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(update);

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe(update.title);
            expect(response.body.data.price).toBe(update.price);
        });

        it('debe mantener participantes al actualizar', async () => {
            // Primero inscribimos un participante
            await request(app)
                .post(`/api/teams/${testTeamId}/events/${testEventId}/register`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ memberId: testMemberId });

            // Actualizamos el evento
            const response = await request(app)
                .put(`/api/teams/${testTeamId}/events/${testEventId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ title: 'Nuevo Título' });

            expect(response.status).toBe(200);
            expect(response.body.data.participants).toContain(testMemberId);
        });
    });

    describe('DELETE /api/teams/:teamId/events/:id', () => {
        it('debe permitir eliminar evento', async () => {
            const response = await request(app)
                .delete(`/api/teams/${testTeamId}/events/${testEventId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(200);

            const deletedEvent = await Event.findById(testEventId);
            expect(deletedEvent).toBeNull();
        });

        it('debe impedir eliminar evento de otro equipo', async () => {
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

            const otherEvent = await Event.create({
                ...validEventData,
                teamId: otherTeam._id
            });

            const response = await request(app)
                .delete(`/api/teams/${otherTeam._id}/events/${otherEvent._id}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(403);
        });
    });
});