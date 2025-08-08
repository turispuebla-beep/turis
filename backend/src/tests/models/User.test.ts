import mongoose from 'mongoose';
import User from '../../models/User';

describe('User Model Test', () => {
    // Prueba de creación de usuario válido
    it('debe crear y guardar un usuario correctamente', async () => {
        const validUser = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'teamAdmin',
            teamId: new mongoose.Types.ObjectId()
        };

        const user = new User(validUser);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe(validUser.email);
        expect(savedUser.name).toBe(validUser.name);
        expect(savedUser.role).toBe(validUser.role);
        expect(savedUser.password).not.toBe(validUser.password); // La contraseña debe estar hasheada
    });

    // Prueba de validación de email
    it('debe fallar al crear un usuario sin email', async () => {
        const userWithoutEmail = new User({
            password: 'password123',
            name: 'Test User',
            role: 'teamAdmin'
        });

        let err;
        try {
            await userWithoutEmail.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Prueba de validación de rol
    it('debe fallar al crear un usuario con rol inválido', async () => {
        const userWithInvalidRole = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'invalidRole'
        });

        let err;
        try {
            await userWithInvalidRole.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Prueba de método comparePassword
    it('debe verificar la contraseña correctamente', async () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'teamAdmin'
        });

        await user.save();

        const isMatch = await user.comparePassword('password123');
        const isNotMatch = await user.comparePassword('wrongpassword');

        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });

    // Prueba de email único
    it('debe fallar al crear un usuario con email duplicado', async () => {
        const firstUser = new User({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User 1',
            role: 'teamAdmin'
        });

        await firstUser.save();

        const duplicateUser = new User({
            email: 'test@example.com',
            password: 'password456',
            name: 'Test User 2',
            role: 'teamAdmin'
        });

        let err;
        try {
            await duplicateUser.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.code).toBe(11000); // Código de error de MongoDB para duplicados
    });
});