import mongoose, { Document } from 'mongoose';

export interface IMember extends Document {
    name: string;
    surname: string;
    dni?: string;
    phone: string;
    email?: string;
    address?: string;
    memberNumber: number;
    registrationDate: Date;
    status: 'pending' | 'active' | 'inactive';
    gender: 'masculino' | 'femenino' | 'otro';
    teamId: mongoose.Types.ObjectId;
    expirationDate?: Date;
}

const memberSchema = new mongoose.Schema({
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
    dni: String,
    phone: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    email: String,
    address: String,
    memberNumber: {
        type: Number,
        required: true,
        unique: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending'
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
    expirationDate: Date
}, {
    timestamps: true
});

// Middleware para generar número de socio/a automáticamente
memberSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastMember = await this.constructor.findOne({}, {}, { sort: { memberNumber: -1 } });
        this.memberNumber = lastMember ? lastMember.memberNumber + 1 : 1;
    }
    next();
});

// Middleware para establecer fecha de expiración automática para socios/as pendientes
memberSchema.pre('save', function(next) {
    if (this.isNew && this.status === 'pending') {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // 7 días para confirmar
        this.expirationDate = expirationDate;
    }
    next();
});

export default mongoose.model<IMember>('Member', memberSchema);