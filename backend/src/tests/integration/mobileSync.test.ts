import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
import Team from '../../models/Team';
import Player from '../../models/Player';
import Member from '../../models/Member';
import Event from '../../models/Event';
import Match from '../../models/Match';
import mongoose from 'mongoose';

describe('Mobile Sync Conflict Resolution', () => {
    let teamAdminToken: string;
    let testTeamId: string;
    let testPlayerId: string;
    let testMemberId: string;
    let testEventId: string;
    let testMatchId: string;

    beforeAll(async () => {
        // Crear equipo de prueba
        const team = await Team.create({
            name: 'Equipo Test',
            category: 'prebenjamin',
            admin: {
                name: 'Admin Test',
                email: 'teamadmin@test.com',
                phone: '123456789'
            }
        });
        testTeamId = team._id.toString();

        // Crear admin de equipo
        await User.create({
            email: 'teamadmin@test.com',
            password: 'password123',
            name: 'Team Admin',
            role: 'teamAdmin',
            teamId: testTeamId
        });

        // Obtener token
        const loginResponse = await request(app)
            .post('/api/v1/mobile/auth/login')
            .send({
                email: 'teamadmin@test.com',
                password: 'password123',
                deviceToken: 'test-fcm-token'
            });
        teamAdminToken = loginResponse.body.token;

        // Crear datos de prueba
        const player = await Player.create({
            name: 'Jugador Test',
            surname: 'Apellido Test',
            dni: '12345678A',
            phone: '123456789',
            birthDate: '2010-01-01',
            teamId: testTeamId,
            gender: 'masculino'
        });
        testPlayerId = player._id.toString();

        const member = await Member.create({
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
        testMemberId = member._id.toString();

        const event = await Event.create({
            title: 'Evento Test',
            description: 'Descripción test',
            date: new Date(),
            price: 10,
            location: 'Ubicación test',
            teamId: testTeamId,
            minParticipants: 5,
            maxParticipants: 20
        });
        testEventId = event._id.toString();

        const match = await Match.create({
            date: new Date(),
            location: 'Campo test',
            category: 'prebenjamin',
            homeTeam: 'Equipo Local',
            awayTeam: 'Equipo Visitante',
            homeScore: 2,
            awayScore: 1,
            teamId: testTeamId,
            players: [{
                playerId: testPlayerId,
                goals: 1,
                assists: 0,
                yellowCards: 0,
                redCard: false,
                minutesPlayed: 60
            }]
        });
        testMatchId = match._id.toString();
    });

    describe('Conflict Detection', () => {
        it('debe detectar conflictos en actualizaciones simultáneas', async () => {
            // Simular actualización en servidor
            await Player.findByIdAndUpdate(testPlayerId, {
                phone: '999999999',
                updatedAt: new Date()
            });

            // Intentar actualización desde móvil con datos antiguos
            const response = await request(app)
                .post('/api/v1/mobile/sync/resolve')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    entity: 'player',
                    id: testPlayerId,
                    data: {
                        phone: '888888888',
                        lastSyncTime: new Date(Date.now() - 1000 * 60).toISOString() // 1 minuto antes
                    }
                });

            expect(response.status).toBe(409);
            expect(response.body.conflict).toBeDefined();
        });

        it('debe resolver conflictos según timestamp más reciente', async () => {
            const newerTimestamp = new Date();
            const olderTimestamp = new Date(Date.now() - 1000 * 60);

            // Datos del servidor (más antiguos)
            await Player.findByIdAndUpdate(testPlayerId, {
                phone: '999999999',
                updatedAt: olderTimestamp
            });

            // Datos del móvil (más recientes)
            const response = await request(app)
                .post('/api/v1/mobile/sync/resolve')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    entity: 'player',
                    id: testPlayerId,
                    data: {
                        phone: '888888888',
                        lastSyncTime: newerTimestamp.toISOString()
                    }
                });

            expect(response.status).toBe(200);
            
            const updatedPlayer = await Player.findById(testPlayerId);
            expect(updatedPlayer?.phone).toBe('888888888');
        });
    });

    describe('Batch Synchronization', () => {
        it('debe procesar múltiples actualizaciones en batch', async () => {
            const updates = {
                players: [{
                    id: testPlayerId,
                    data: {
                        phone: '777777777'
                    }
                }],
                members: [{
                    id: testMemberId,
                    data: {
                        phone: '666666666'
                    }
                }],
                events: [{
                    id: testEventId,
                    data: {
                        price: 15
                    }
                }]
            };

            const response = await request(app)
                .post('/api/v1/mobile/sync/batch')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(updates);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.results).toBeDefined();

            // Verificar actualizaciones
            const player = await Player.findById(testPlayerId);
            const member = await Member.findById(testMemberId);
            const event = await Event.findById(testEventId);

            expect(player?.phone).toBe('777777777');
            expect(member?.phone).toBe('666666666');
            expect(event?.price).toBe(15);
        });
    });

    describe('Offline Data Management', () => {
        it('debe manejar creación offline de registros', async () => {
            const offlineId = new mongoose.Types.ObjectId().toString();
            
            const response = await request(app)
                .post('/api/v1/mobile/sync/offline')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    entity: 'match',
                    tempId: offlineId,
                    data: {
                        date: new Date(),
                        location: 'Campo offline',
                        category: 'prebenjamin',
                        homeTeam: 'Local',
                        awayTeam: 'Visitante',
                        homeScore: 1,
                        awayScore: 1,
                        teamId: testTeamId,
                        players: [{
                            playerId: testPlayerId,
                            goals: 1,
                            minutesPlayed: 90
                        }]
                    }
                });

            expect(response.status).toBe(201);
            expect(response.body.data._id).toBeDefined();
            expect(response.body.data.tempId).toBe(offlineId);
        });

        it('debe sincronizar eliminaciones offline', async () => {
            const response = await request(app)
                .post('/api/v1/mobile/sync/deletions')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    deletions: [{
                        entity: 'match',
                        id: testMatchId,
                        timestamp: new Date().toISOString()
                    }]
                });

            expect(response.status).toBe(200);
            
            const deletedMatch = await Match.findById(testMatchId);
            expect(deletedMatch).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('debe manejar errores de validación en batch', async () => {
            const updates = {
                players: [{
                    id: testPlayerId,
                    data: {
                        phone: 'invalid-phone' // Formato inválido
                    }
                }]
            };

            const response = await request(app)
                .post('/api/v1/mobile/sync/batch')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(updates);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('debe manejar IDs inválidos', async () => {
            const response = await request(app)
                .post('/api/v1/mobile/sync/resolve')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    entity: 'player',
                    id: 'invalid-id',
                    data: {
                        phone: '123456789'
                    }
                });

            expect(response.status).toBe(400);
        });

        it('debe prevenir actualizaciones no autorizadas', async () => {
            // Crear otro equipo y jugador
            const otherTeam = await Team.create({
                name: 'Otro Equipo',
                category: 'benjamin'
            });

            const otherPlayer = await Player.create({
                name: 'Otro Jugador',
                surname: 'Apellido',
                dni: '98765432Z',
                phone: '987654321',
                birthDate: '2010-01-01',
                teamId: otherTeam._id,
                gender: 'masculino'
            });

            const response = await request(app)
                .post('/api/v1/mobile/sync/resolve')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({
                    entity: 'player',
                    id: otherPlayer._id,
                    data: {
                        phone: '123456789'
                    }
                });

            expect(response.status).toBe(403);
        });
    });
});