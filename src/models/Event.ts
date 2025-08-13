import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  titulo: string;
  descripcion: string;
  fecha: Date;
  precio: number;
  minimoInscritos: number;
  maximoInscritos: number;
  inscritos: mongoose.Types.ObjectId[];
  foto?: string;
  permitirFotos: boolean;
  estado: 'activo' | 'cancelado' | 'completado';
  creadoPor: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  minimoInscritos: {
    type: Number,
    required: true,
    min: 1
  },
  maximoInscritos: {
    type: Number,
    required: true,
    min: 1
  },
  inscritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Member'
  }],
  foto: {
    type: String
  },
  permitirFotos: {
    type: Boolean,
    default: true
  },
  estado: {
    type: String,
    enum: ['activo', 'cancelado', 'completado'],
    default: 'activo'
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);