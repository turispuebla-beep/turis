import mongoose, { Document } from 'mongoose';

export interface IPlayer extends Document {
    name: string;
    surname: string;
    dni: string;
    phone: string;
    address?: string;
    birthDate: Date;
    jerseyNumber: number;
    gender: 'masculino' | 'femenino' | 'otro';
    teamId: mongoose.Types.ObjectId;
    guardianInfo?: {
        name: string;
        dni: string;
        phone: string;
        address: string;
        email: string;
        relation: string; // padre/madre/tutor/tutora
    }[];
    photoConsent: boolean;
    teamConsent: boolean;
}

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'Los apellidos son obligatorios'],
        trim: true
    },
    dni: {
        type: String,
        required: [true, 'El DNI es obligatorio'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    address: String,
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    jerseyNumber: {
        type: Number,
        required: [true, 'El número de camiseta es obligatorio']
    },
    gender: {
        type: String,
        enum: ['masculino', 'femenino', 'otro'],
        required: [true, 'El género es obligatorio']
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo es obligatorio']
    },
    guardianInfo: [{
        name: {
            type: String,
            required: [true, 'El nombre del padre/madre/tutor/tutora es obligatorio']
        },
        dni: {
            type: String,
            required: [true, 'El DNI del padre/madre/tutor/tutora es obligatorio']
        },
        phone: {
            type: String,
            required: [true, 'El teléfono del padre/madre/tutor/tutora es obligatorio']
        },
        address: {
            type: String,
            required: [true, 'La dirección del padre/madre/tutor/tutora es obligatoria']
        },
        email: {
            type: String,
            required: [true, 'El email del padre/madre/tutor/tutora es obligatorio']
        },
        relation: {
            type: String,
            required: [true, 'La relación con el/la jugador/a es obligatoria'],
            enum: ['padre', 'madre', 'tutor', 'tutora']
        }
    }],
    photoConsent: {
        type: Boolean,
        default: false
    },
    teamConsent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Middleware para validar la edad y los datos del tutor
playerSchema.pre('save', function(next) {
    const age = new Date().getFullYear() - this.birthDate.getFullYear();
    
    if (age < 18 && (!this.guardianInfo || this.guardianInfo.length === 0)) {
        const error = new Error('Los/as jugadores/as menores de edad deben tener información del padre/madre/tutor/tutora');
        return next(error);
    }

    next();
});

export default mongoose.model<IPlayer>('Player', playerSchema);