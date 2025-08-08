import mongoose, { Document } from 'mongoose';

export interface IFriend extends Document {
    name: string;
    surname: string;
    dni?: string;
    phone: string;
    email?: string;
    gender: 'masculino' | 'femenino' | 'otro';
    teamId: mongoose.Types.ObjectId;
}

const friendSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        enum: ['masculino', 'femenino', 'otro'],
        required: [true, 'El género es obligatorio']
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo es obligatorio']
    }
}, {
    timestamps: true
});

export default mongoose.model<IFriend>('Friend', friendSchema);