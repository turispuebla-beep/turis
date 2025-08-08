import { ValidationRules, RegistrationData } from '../types/registration';

export const validateRegistrationData = (data: Partial<RegistrationData>): string[] => {
    const errors: string[] = [];
    const rules: ValidationRules = {
        name: {
            minLength: 2,
            maxLength: 50,
            required: true
        },
        surname: {
            minLength: 2,
            maxLength: 50,
            required: true
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            required: true
        },
        password: {
            minLength: 6,
            requireNumbers: true,
            requireSpecialChar: true,
            required: true
        },
        phone: {
            pattern: /^\+?[0-9]{9,15}$/,
            required: false
        },
        teamId: {
            pattern: /^[A-Z0-9]{6,8}$/,
            required: false
        },
        accessCode: {
            pattern: /^[A-Z0-9]{8}$/,
            required: false
        }
    };

    // Validar nombre
    if (rules.name.required && !data.name) {
        errors.push('El nombre es obligatorio');
    } else if (data.name) {
        if (data.name.length < rules.name.minLength) {
            errors.push(`El nombre debe tener al menos ${rules.name.minLength} caracteres`);
        }
        if (data.name.length > rules.name.maxLength) {
            errors.push(`El nombre no puede tener más de ${rules.name.maxLength} caracteres`);
        }
    }

    // Validar apellidos
    if (rules.surname.required && !data.surname) {
        errors.push('Los apellidos son obligatorios');
    } else if (data.surname) {
        if (data.surname.length < rules.surname.minLength) {
            errors.push(`Los apellidos deben tener al menos ${rules.surname.minLength} caracteres`);
        }
        if (data.surname.length > rules.surname.maxLength) {
            errors.push(`Los apellidos no pueden tener más de ${rules.surname.maxLength} caracteres`);
        }
    }

    // Validar email
    if (rules.email.required && !data.email) {
        errors.push('El email es obligatorio');
    } else if (data.email && !rules.email.pattern.test(data.email)) {
        errors.push('El formato del email no es válido');
    }

    // Validar contraseña
    if (rules.password.required && !data.password) {
        errors.push('La contraseña es obligatoria');
    } else if (data.password) {
        if (data.password.length < rules.password.minLength) {
            errors.push(`La contraseña debe tener al menos ${rules.password.minLength} caracteres`);
        }
        if (rules.password.requireNumbers && !/\d/.test(data.password)) {
            errors.push('La contraseña debe contener al menos un número');
        }
        if (rules.password.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
            errors.push('La contraseña debe contener al menos un carácter especial');
        }
    }

    // Validar teléfono (opcional)
    if (data.phone && !rules.phone.pattern.test(data.phone)) {
        errors.push('El formato del teléfono no es válido');
    }

    // Validar ID de equipo (si se proporciona)
    if (data.teamId && !rules.teamId.pattern.test(data.teamId)) {
        errors.push('El formato del ID de equipo no es válido');
    }

    // Validar código de acceso (si se proporciona)
    if (data.accessCode && !rules.accessCode.pattern.test(data.accessCode)) {
        errors.push('El formato del código de acceso no es válido');
    }

    return errors;
};