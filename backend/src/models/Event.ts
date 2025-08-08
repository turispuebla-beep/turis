import mongoose from 'mongoose';

export interface IEvent extends mongoose.Document {
    title: string;
    description: string;
    date: Date;
    endDate?: Date;
    location: string;
    price: number;
    category: string;
    teamId: mongoose.Types.ObjectId;
    minParticipants: number;
    maxParticipants: number;
    participants: Array<{
        memberId: mongoose.Types.ObjectId;
        registrationDate: Date;
        photoConsent: boolean;
        paid: boolean;
        notes?: string;
    }>;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    image?: string;
    photos: string[];
    videos: string[];
    documents: Array<{
        name: string;
        url: string;
        type: string;
    }>;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        validate: {
            validator: function(value: Date) {
                return value > new Date();
            },
            message: 'La fecha debe ser posterior a la actual'
        }
    },
    endDate: {
        type: Date,
        validate: {
            validator: function(this: IEvent, value: Date) {
                return !value || value > this.date;
            },
            message: 'La fecha de finalización debe ser posterior a la fecha de inicio'
        }
    },
    location: {
        type: String,
        required: [true, 'La ubicación es obligatoria']
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'El precio no puede ser negativo']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: {
            values: ['entrenamiento', 'partido', 'torneo', 'social', 'otros'],
            message: 'Categoría no válida'
        }
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo es obligatorio']
    },
    minParticipants: {
        type: Number,
        default: 0,
        min: [0, 'El mínimo de participantes no puede ser negativo']
    },
    maxParticipants: {
        type: Number,
        validate: {
            validator: function(this: IEvent, value: number) {
                return value >= this.minParticipants;
            },
            message: 'El máximo de participantes debe ser mayor o igual al mínimo'
        }
    },
    participants: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        photoConsent: {
            type: Boolean,
            default: false
        },
        paid: {
            type: Boolean,
            default: false
        },
        notes: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'draft'
    },
    image: {
        type: String
    },
    photos: [{
        type: String
    }],
    videos: [{
        type: String
    }],
    documents: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
EventSchema.index({ teamId: 1, date: -1 });
EventSchema.index({ status: 1 });
EventSchema.index({ 'participants.memberId': 1 });

// Virtuals
EventSchema.virtual('participantCount').get(function(this: IEvent) {
    return this.participants.length;
});

EventSchema.virtual('isFullyBooked').get(function(this: IEvent) {
    return this.maxParticipants > 0 && this.participants.length >= this.maxParticipants;
});

EventSchema.virtual('availableSpots').get(function(this: IEvent) {
    if (this.maxParticipants === 0) return Infinity;
    return Math.max(0, this.maxParticipants - this.participants.length);
});

// Middleware
EventSchema.pre('save', async function(next) {
    // Actualizar estado automáticamente
    if (this.isModified('participants')) {
        if (this.participants.length >= this.minParticipants && this.status === 'draft') {
            this.status = 'published';
        }
    }

    // Verificar si la fecha ha pasado
    if (this.date < new Date() && this.status !== 'completed' && this.status !== 'cancelled') {
        this.status = 'completed';
    }

    next();
});

// Métodos
EventSchema.methods.canRegister = function(memberId: mongoose.Types.ObjectId): boolean {
    // Verificar si el miembro ya está registrado
    const isRegistered = this.participants.some(p => p.memberId.toString() === memberId.toString());
    if (isRegistered) return false;

    // Verificar si hay cupo disponible
    if (this.maxParticipants > 0 && this.participants.length >= this.maxParticipants) {
        return false;
    }

    // Verificar si el evento está publicado
    if (this.status !== 'published') return false;

    // Verificar si la fecha no ha pasado
    return this.date > new Date();
};

EventSchema.methods.addParticipant = async function(
    memberId: mongoose.Types.ObjectId,
    photoConsent: boolean = false
): Promise<boolean> {
    if (!this.canRegister(memberId)) return false;

    this.participants.push({
        memberId,
        photoConsent,
        registrationDate: new Date(),
        paid: this.price === 0
    });

    await this.save();
    return true;
};

EventSchema.methods.removeParticipant = async function(
    memberId: mongoose.Types.ObjectId
): Promise<boolean> {
    const initialLength = this.participants.length;
    this.participants = this.participants.filter(
        p => p.memberId.toString() !== memberId.toString()
    );

    if (this.participants.length === initialLength) return false;

    await this.save();
    return true;
};

export default mongoose.model<IEvent>('Event', EventSchema);