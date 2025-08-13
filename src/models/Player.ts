import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  edad: number;
  fechaNacimiento: Date;
  dorsal: number;
  equipoId: mongoose.Types.ObjectId;
  tutorInfo?: {
    nombre: string;
    dni: string;
    telefono: string;
    direccion: string;
    email: string;
    relacion: 'padre' | 'madre' | 'tutor' | 'tutora';
  }[];
  consentimientoFotos: boolean;
  consentimientoEquipo: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const playerSchema = new Schema<IPlayer>({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  dni: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  edad: {
    type: Number,
    required: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  dorsal: {
    type: Number,
    required: true
  },
  equipoId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  tutorInfo: [{
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    dni: {
      type: String,
      required: true,
      trim: true
    },
    telefono: {
      type: String,
      required: true,
      trim: true
    },
    direccion: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    relacion: {
      type: String,
      enum: ['padre', 'madre', 'tutor', 'tutora'],
      required: true
    }
  }],
  consentimientoFotos: {
    type: Boolean,
    default: false
  },
  consentimientoEquipo: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate age automatically from birth date
playerSchema.pre('save', function(next) {
  if (this.fechaNacimiento) {
    const today = new Date();
    const birthDate = new Date(this.fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.edad = age;
  }
  
  // Validate guardian info for minors
  if (this.edad < 18 && (!this.tutorInfo || this.tutorInfo.length === 0)) {
    const error = new Error('Los jugadores menores de edad deben tener información del padre/madre/tutor/tutora');
    return next(error);
  }

  next();
});

export const Player = mongoose.model<IPlayer>('Player', playerSchema);