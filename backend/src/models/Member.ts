import mongoose, { Document, Schema } from 'mongoose';

export interface IMember extends Document {
  numeroSocio: string;
  nombre: string;
  apellidos: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaRegistro: Date;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  pagado: boolean;
  fechaConfirmacion?: Date;
  confirmadoPor?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>({
  numeroSocio: {
    type: String,
    required: true,
    unique: true
  },
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
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
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
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'rechazado'],
    default: 'pendiente'
  },
  pagado: {
    type: Boolean,
    default: false
  },
  fechaConfirmacion: {
    type: Date
  },
  confirmadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate numeroSocio before saving
memberSchema.pre('save', async function(next) {
  if (this.isNew && !this.numeroSocio) {
    const lastMember = await mongoose.model('Member').findOne().sort({ numeroSocio: -1 });
    let nextNumber = 1;
    
    if (lastMember) {
      const lastNumber = parseInt(lastMember.numeroSocio.replace('SOC-', ''));
      nextNumber = lastNumber + 1;
    }
    
    this.numeroSocio = `SOC-${nextNumber.toString().padStart(4, '0')}`;
  }
  next();
});

export const Member = mongoose.model<IMember>('Member', memberSchema);