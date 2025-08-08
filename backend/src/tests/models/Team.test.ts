import mongoose from 'mongoose';
import Team from '../../models/Team';

describe('Team Model Test', () => {
    // Datos válidos de ejemplo
    const validTeamData = {
        name: 'Equipo de Prueba',
        category: 'prebenjamin',
        admin: {
            name: 'Admin Test',
            email: 'admin@test.com',
            phone: '123456789'
        },
        coach: {
            name: 'Coach Test',
            phone: '987654321',
            email: 'coach@test.com'
        },
        contactInfo: {
            email: 'equipo@test.com',
            phone: '123123123'
        }
    };

    // Prueba de creación de equipo válido
    it('debe crear y guardar un equipo correctamente', async () => {
        const team = new Team(validTeamData);
        const savedTeam = await team.save();

        expect(savedTeam._id).toBeDefined();
        expect(savedTeam.name).toBe(validTeamData.name);
        expect(savedTeam.category).toBe(validTeamData.category);
        expect(savedTeam.admin.email).toBe(validTeamData.admin.email);
    });

    // Prueba de validación de campos requeridos
    it('debe fallar al crear un equipo sin nombre', async () => {
        const teamWithoutName = new Team({
            ...validTeamData,
            name: undefined
        });

        let err;
        try {
            await teamWithoutName.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });

    // Prueba de validación de categoría
    it('debe fallar al crear un equipo con categoría inválida', async () => {
        const teamWithInvalidCategory = new Team({
            ...validTeamData,
            category: 'categoriaInvalida'
        });

        let err;
        try {
            await teamWithInvalidCategory.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.category).toBeDefined();
    });

    // Prueba de información de administrador/a
    it('debe requerir información completa del administrador/a', async () => {
        const teamWithIncompleteAdmin = new Team({
            ...validTeamData,
            admin: {
                name: 'Admin Test'
                // Falta email y teléfono
            }
        });

        let err;
        try {
            await teamWithIncompleteAdmin.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors['admin.email']).toBeDefined();
        expect(err.errors['admin.phone']).toBeDefined();
    });

    // Prueba de información de contacto
    it('debe requerir información de contacto básica', async () => {
        const teamWithoutContactInfo = new Team({
            ...validTeamData,
            contactInfo: {}
        });

        let err;
        try {
            await teamWithoutContactInfo.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors['contactInfo.email']).toBeDefined();
        expect(err.errors['contactInfo.phone']).toBeDefined();
    });

    // Prueba de información opcional del entrenador/a
    it('debe permitir crear equipo sin información del entrenador/a', async () => {
        const teamWithoutCoach = new Team({
            ...validTeamData,
            coach: undefined
        });

        const savedTeam = await teamWithoutCoach.save();
        expect(savedTeam._id).toBeDefined();
        expect(savedTeam.coach).toBeUndefined();
    });

    // Prueba de actualización de equipo
    it('debe actualizar la información del equipo correctamente', async () => {
        const team = new Team(validTeamData);
        const savedTeam = await team.save();

        const updatedName = 'Nuevo Nombre del Equipo';
        savedTeam.name = updatedName;
        const updatedTeam = await savedTeam.save();

        expect(updatedTeam.name).toBe(updatedName);
        expect(updatedTeam.modifiedCount).toBeDefined();
    });

    // Prueba de nombre único por categoría
    it('debe permitir nombres duplicados en diferentes categorías', async () => {
        const team1 = new Team(validTeamData);
        await team1.save();

        const team2 = new Team({
            ...validTeamData,
            category: 'benjamin' // Diferente categoría
        });

        let err;
        try {
            await team2.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeUndefined();
    });
});