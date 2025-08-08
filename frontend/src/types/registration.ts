export interface RegistrationData {
    name: string;
    surname: string;
    email: string;
    password: string;
    phone?: string;
    teamId?: string;
    userType?: 'socio' | 'amigo' | 'familiar' | 'admin';
    accessCode?: string;
}

export interface ValidationRules {
    name: {
        minLength: 2,
        maxLength: 50,
        required: true
    };
    surname: {
        minLength: 2,
        maxLength: 50,
        required: true
    };
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true
    };
    password: {
        minLength: 6,
        requireNumbers: true,
        requireSpecialChar: true,
        required: true
    };
    phone: {
        pattern: /^\+?[0-9]{9,15}$/,
        required: false
    };
    teamId: {
        pattern: /^[A-Z0-9]{6,8}$/,
        required: false
    };
    accessCode: {
        pattern: /^[A-Z0-9]{8}$/,
        required: false
    };
}