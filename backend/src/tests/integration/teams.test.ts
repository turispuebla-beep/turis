import request from 'supertest';
import app from '../../app';
import Team from '../../models/Team';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('Team Endpoints', () => {
    let adminToken: string;
    let teamAdminToken: string;
    let testTeamId: string;

    beforeAll(async () => {
        // Crear admin y obtener token
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'amco@gmx.es',
                password: '533712'
            });
        adminToken = adminLogin.body.token;

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

        // Crear admin de equipo y obtener token
        const teamAdmin = await User.create({
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
    });

    beforeEach(async () => {
        // Limpiar datos excepto usuarios y equipo de prueba
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            if (key !== 'users' && key !== 'teams') {
                await collections[key].deleteMany({});
            }
        }
    });

    describe('GET /api/teams', () => {
        it('debe permitir al admin ver todos los equipos', async () => {
            const response = await request(app)
                .get('/api/teams')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('debe permitir al admin de equipo ver solo su equipo', async () => {
            const response = await request(app)
                .get('/api/teams')
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0]._id).toBe(testTeamId);
        });
    });

    describe('POST /api/teams', () => {
        it('debe permitir al admin crear nuevo equipo', async () => {
            const newTeam = {
                name: 'Nuevo Equipo',
                category: 'benjamin',
                admin: {
                    name: 'Nuevo Admin',
                    email: 'nuevoadmin@test.com',
                    phone: '123123123'
                },
                contactInfo: {
                    email: 'nuevo@test.com',
                    phone: '321321321'
                }
            };

            const response = await request(app)
                .post('/api/teams')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newTeam);

            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(newTeam.name);
        });

        it('debe impedir que admin de equipo cree equipos', async () => {
            const newTeam = {
                name: 'Equipo No Permitido',
                category: 'benjamin',
                admin: {
                    name: 'Admin',
                    email: 'admin@test.com',
                    phone: '123123123'
                },
                contactInfo: {
                    email: 'equipo@test.com',
                    phone: '321321321'
                }
            };

            const response = await request(app)
                .post('/api/teams')
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(newTeam);

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/teams/:id', () => {
        it('debe permitir al admin actualizar cualquier equipo', async () => {
            const update = {
                name: 'Equipo Actualizado',
                contactInfo: {
                    email: 'actualizado@test.com',
                    phone: '999999999'
                }
            };

            const response = await request(app)
                .put(`/api/teams/${testTeamId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(update);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(update.name);
        });

        it('debe permitir al admin de equipo actualizar solo su equipo', async () => {
            const update = {
                contactInfo: {
                    email: 'nuevo@test.com',
                    phone: '888888888'
                }
            };

            const response = await request(app)
                .put(`/api/teams/${testTeamId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send(update);

            expect(response.status).toBe(200);
            expect(response.body.data.contactInfo.email).toBe(update.contactInfo.email);
        });

        it('debe impedir que admin de equipo actualice otros equipos', async () => {
            const otherTeam = await Team.create({
                name: 'Otro Equipo',
                category: 'alevin',
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

            const response = await request(app)
                .put(`/api/teams/${otherTeam._id}`)
                .set('Authorization', `Bearer ${teamAdminToken}`)
                .send({ name: 'Intento Actualización' });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/teams/:id', () => {
        it('debe permitir al admin eliminar equipos', async () => {
            const teamToDelete = await Team.create({
                name: 'Equipo a Eliminar',
                category: 'infantil',
                admin: {
                    name: 'Admin',
                    email: 'admin@test.com',
                    phone: '123456789'
                },
                contactInfo: {
                    email: 'eliminar@test.com',
                    phone: '987654321'
                }
            });

            const response = await request(app)
                .delete(`/api/teams/${teamToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            const deletedTeam = await Team.findById(teamToDelete._id);
            expect(deletedTeam).toBeNull();
        });

        it('debe impedir que admin de equipo elimine equipos', async () => {
            const response = await request(app)
                .delete(`/api/teams/${testTeamId}`)
                .set('Authorization', `Bearer ${teamAdminToken}`);

            expect(response.status).toBe(403);

            const teamStillExists = await Team.findById(testTeamId);
            expect(teamStillExists).not.toBeNull();
        });
    });
});