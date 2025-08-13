import mongoose from 'mongoose';

export interface IMatch extends mongoose.Document {
    teamId: mongoose.Types.ObjectId;
    competition: string;
    date: Date;
    location: string;
    category: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
    players: Array<{
        playerId: mongoose.Types.ObjectId;
        goals: number;
        assists: number;
        yellowCards: number;
        redCard: boolean;
        minutesPlayed: number;
        position?: string;
        number?: number;
        substitute: boolean;
        substitutionMinute?: number;
    }>;
    summary?: string;
    highlights?: string;
    photos: string[];
    videos: string[];
    weather?: {
        condition: string;
        temperature: number;
        humidity: number;
    };
    referee?: string;
    attendance?: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MatchSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo es obligatorio']
    },
    competition: {
        type: String,
        required: [true, 'La competición es obligatoria'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    location: {
        type: String,
        required: [true, 'La ubicación es obligatoria']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: {
            values: ['prebenjamin', 'benjamin', 'alevin', 'infantil', 'aficionado'],
            message: 'Categoría no válida'
        }
    },
    homeTeam: {
        type: String,
        required: [true, 'El equipo local es obligatorio']
    },
    awayTeam: {
        type: String,
        required: [true, 'El equipo visitante es obligatorio']
    },
    homeScore: {
        type: Number,
        min: [0, 'El marcador no puede ser negativo']
    },
    awayScore: {
        type: Number,
        min: [0, 'El marcador no puede ser negativo']
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
        default: 'scheduled'
    },
    players: [{
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true
        },
        goals: {
            type: Number,
            default: 0,
            min: 0
        },
        assists: {
            type: Number,
            default: 0,
            min: 0
        },
        yellowCards: {
            type: Number,
            default: 0,
            min: 0,
            max: 2
        },
        redCard: {
            type: Boolean,
            default: false
        },
        minutesPlayed: {
            type: Number,
            required: true,
            min: 0,
            max: 90
        },
        position: String,
        number: Number,
        substitute: {
            type: Boolean,
            default: false
        },
        substitutionMinute: Number
    }],
    summary: String,
    highlights: String,
    photos: [String],
    videos: [String],
    weather: {
        condition: String,
        temperature: Number,
        humidity: Number
    },
    referee: String,
    attendance: {
        type: Number,
        min: 0
    },
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
MatchSchema.index({ teamId: 1, date: -1 });
MatchSchema.index({ category: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ competition: 1 });

// Virtuals
MatchSchema.virtual('result').get(function(this: IMatch) {
    if (!this.homeScore || !this.awayScore) return null;
    if (this.homeScore > this.awayScore) return 'victory';
    if (this.homeScore < this.awayScore) return 'defeat';
    return 'draw';
});

MatchSchema.virtual('goalDifference').get(function(this: IMatch) {
    if (!this.homeScore || !this.awayScore) return null;
    return this.homeScore - this.awayScore;
});

MatchSchema.virtual('isHomeMatch').get(function(this: IMatch) {
    return this.homeTeam === 'Club de Fútbol'; // Ajustar según el nombre real del club
});

// Middleware
MatchSchema.pre('save', function(next) {
    // Validar tarjetas
    this.players.forEach(player => {
        if (player.yellowCards === 2) {
            player.redCard = true;
        }
    });

    // Validar sustituciones
    if (this.players.some(p => p.substitute && !p.substitutionMinute)) {
        throw new Error('Los jugadores sustitutos deben tener minuto de sustitución');
    }

    next();
});

// Métodos
MatchSchema.methods.updateScore = async function(
    homeScore: number,
    awayScore: number
): Promise<void> {
    this.homeScore = homeScore;
    this.awayScore = awayScore;
    this.status = 'completed';
    await this.save();
};

MatchSchema.methods.postpone = async function(
    newDate: Date
): Promise<void> {
    this.date = newDate;
    this.status = 'postponed';
    await this.save();
};

MatchSchema.methods.cancel = async function(): Promise<void> {
    this.status = 'cancelled';
    await this.save();
};

MatchSchema.methods.startMatch = async function(): Promise<void> {
    if (this.status !== 'scheduled') {
        throw new Error('El partido no está programado');
    }
    this.status = 'in_progress';
    await this.save();
};

MatchSchema.methods.addPlayer = async function(
    playerId: mongoose.Types.ObjectId,
    isSubstitute: boolean = false
): Promise<void> {
    if (this.players.some(p => p.playerId.toString() === playerId.toString())) {
        throw new Error('El jugador ya está en la alineación');
    }

    this.players.push({
        playerId,
        substitute: isSubstitute,
        minutesPlayed: 0
    });

    await this.save();
};

MatchSchema.methods.removePlayer = async function(
    playerId: mongoose.Types.ObjectId
): Promise<void> {
    this.players = this.players.filter(
        p => p.playerId.toString() !== playerId.toString()
    );
    await this.save();
};

MatchSchema.methods.updatePlayerStats = async function(
    playerId: mongoose.Types.ObjectId,
    stats: Partial<IMatch['players'][0]>
): Promise<void> {
    const playerIndex = this.players.findIndex(
        p => p.playerId.toString() === playerId.toString()
    );

    if (playerIndex === -1) {
        throw new Error('Jugador no encontrado');
    }

    this.players[playerIndex] = {
        ...this.players[playerIndex],
        ...stats
    };

    await this.save();
};

export default mongoose.model<IMatch>('Match', MatchSchema);