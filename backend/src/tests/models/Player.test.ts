import mongoose from 'mongoose';
import Player from '../../models/Player';

describe('Player Model Test', () => {
    const validPlayerData = {
        name: 'Jugador/a Test',
        surname: 'Apellido Test',
        dni: '12345678A',
        phone: '123456789',
        birthDate: new Date('2010-01-01'), // Menor de edad
        jerseyNumber: 10,
        teamId: new mongoose.Types.ObjectId(),
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

    // Prueba de creación de jugador/a válido/a
    it('debe crear y guardar un/a jugador/a correctamente', async () => {
        const player = new Player(validPlayerData);
        const savedPlayer = await player.save();

        expect(savedPlayer._id).toBeDefined();
        expect(savedPlayer.name).toBe(validPlayerData.name);
        expect(savedPlayer.dni).toBe(validPlayerData.dni);
    });

    // Prueba de campos requeridos
    it('debe fallar al crear jugador/a sin campos requeridos', async () => {
        const playerWithoutRequired = new Player({
            name: 'Test'
            // Faltan campos requeridos
        });

        let err;
        try {
            await playerWithoutRequired.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.surname).toBeDefined();
        expect(err.errors.dni).toBeDefined();
        expect(err.errors.phone).toBeDefined();
        expect(err.errors.birthDate).toBeDefined();
    });

    // Prueba de validación de DNI único
    it('debe fallar al crear jugador/a con DNI duplicado', async () => {
        const player1 = new Player(validPlayerData);
        await player1.save();

        const player2 = new Player({
            ...validPlayerData,
            name: 'Otro/a Jugador/a'
        });

        let err;
        try {
            await player2.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.code).toBe(11000); // Error de duplicado
    });

    // Prueba de validación de edad y tutores
    it('debe requerir información de tutores para menores de edad', async () => {
        const playerWithoutGuardian = new Player({
            ...validPlayerData,
            guardianInfo: undefined
        });

        let err;
        try {
            await playerWithoutGuardian.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.message).toContain('menores de edad');
    });

    // Prueba de jugador/a mayor de edad
    it('debe permitir crear jugador/a mayor de edad sin tutores', async () => {
        const adultPlayer = new Player({
            ...validPlayerData,
            birthDate: new Date('2000-01-01'), // Mayor de edad
            guardianInfo: undefined
        });

        const savedPlayer = await adultPlayer.save();
        expect(savedPlayer._id).toBeDefined();
        expect(savedPlayer.guardianInfo).toBeUndefined();
    });

    // Prueba de validación de género
    it('debe validar el género correctamente', async () => {
        const playerWithInvalidGender = new Player({
            ...validPlayerData,
            gender: 'invalido'
        });

        let err;
        try {
            await playerWithInvalidGender.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.gender).toBeDefined();
    });

    // Prueba de número de camiseta
    it('debe validar el número de camiseta', async () => {
        const playerWithInvalidNumber = new Player({
            ...validPlayerData,
            jerseyNumber: -1
        });

        let err;
        try {
            await playerWithInvalidNumber.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.jerseyNumber).toBeDefined();
    });

    // Prueba de consentimientos
    it('debe manejar los consentimientos correctamente', async () => {
        const player = new Player({
            ...validPlayerData,
            photoConsent: false,
            teamConsent: false
        });

        const savedPlayer = await player.save();
        expect(savedPlayer.photoConsent).toBe(false);
        expect(savedPlayer.teamConsent).toBe(false);
    });
});