import request from 'supertest';
import app from '../../app';
import Player from '../../models/Player';
import Team from '../../models/Team';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('Player Endpoints', () => {
    let adminToken: string;
    let teamAdminToken: string;
    let testTeamId: string;
    let testPlayerId: string;

    const validPlayerData = {
        name: 'Jugador/a Test',
        surname: 'Apellido Test',
        dni: '12345678A',
        phone: '123456789',
        birthDate: '2010-01-01', // Menor de edad
        jerseyNumber: 10,
        gender: 'masculino',
        guardianInfo: [{
            name: 'Tutor/a Test',
            dni: '87654321B',
            phone: '987654321',
            address: 'Dirección Test',
            email: 'tutor@test.com',
            relation: 'padre'
        }],
        photoConsent: true,
        teamConsent: true
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

        // Crear jugador/a de prueba
        const player = await Player.create({
            ...validPlayerData,
            teamId: testTeamId
        });
        testPlayerId = player._id.toString();
    });

    beforeEach(async () => {
        // Limpiar jugadores excepto el de prueba
        await Player.deleteMany({ _id: { $ne: testPlayerId } });
    });

    describe('GET /api/teams/:teamId/players', () => {
        it('debe permitir al admin ver jugadores/as de cualquier equipo', async () => {
            const response = await request(app)
                .get(`/api/teams/${testTeamId}/players`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('debe permitir al admin de equipo ver solo sus jugadores/as', async () => {
            const response = await request(app)
                .get(`/api/teams/${testTeamId}/players`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0].teamId).toBe(testTeamId);
        });
    });

    describe('POST /api/teams/:teamId/players', () => {
        it('debe permitir añadir jugador/a con datos válidos', async () => {
            const newPlayer = {
                ...validPlayerData,
                dni: '11111111A' // DNI diferente
            };

            const response = await request(app)
                .post(`/api/teams/${testTeamId}/players`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(newPlayer);

            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(newPlayer.name);
            expect(response.body.data.teamId).toBe(testTeamId);
        });

        it('debe validar datos de tutor/a para menores', async () => {
            const invalidPlayer = {
                ...validPlayerData,
                dni: '22222222B',
                guardianInfo: undefined // Falta información del tutor/a
            };

            const response = await request(app)
                .post(`/api/teams/${testTeamId}/players`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(invalidPlayer);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('tutor');
        });

        it('debe impedir DNIs duplicados', async () => {
            const duplicatePlayer = {
                ...validPlayerData // Mismo DNI que el jugador de prueba
            };

            const response = await request(app)
                .post(`/api/teams/${testTeamId}/players`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(duplicatePlayer);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('DNI');
        });
    });

    describe('PUT /api/teams/:teamId/players/:id', () => {
        it('debe permitir actualizar datos del jugador/a', async () => {
            const update = {
                phone: '999999999',
                jerseyNumber: 20
            };

            const response = await request(app)
                .put(`/api/teams/${testTeamId}/players/${testPlayerId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(update);

            expect(response.status).toBe(200);
            expect(response.body.data.phone).toBe(update.phone);
            expect(response.body.data.jerseyNumber).toBe(update.jerseyNumber);
        });

        it('debe mantener validación de tutores al actualizar', async () => {
            const update = {
                birthDate: '2010-01-01', // Menor de edad
                guardianInfo: [] // Sin información de tutores
            };

            const response = await request(app)
                .put(`/api/teams/${testTeamId}/players/${testPlayerId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(update);

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('tutor');
        });
    });

    describe('DELETE /api/teams/:teamId/players/:id', () => {
        it('debe permitir eliminar jugador/a', async () => {
            const response = await request(app)
                .delete(`/api/teams/${testTeamId}/players/${testPlayerId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(200);

            const deletedPlayer = await Player.findById(testPlayerId);
            expect(deletedPlayer).toBeNull();
        });

        it('debe impedir eliminar jugador/a de otro equipo', async () => {
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

            const otherPlayer = await Player.create({
                ...validPlayerData,
                dni: '33333333C',
                teamId: otherTeam._id
            });

            const response = await request(app)
                .delete(`/api/teams/${otherTeam._id}/players/${otherPlayer._id}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(403);
        });
    });
});