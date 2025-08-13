import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  nombre: string;
  categoria: 'Prebenjamín' | 'Benjamín' | 'Alevín' | 'Infantil' | 'Aficionado';
  descripcion?: string;
  colorPrincipal?: string;
  colorSecundario?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    enum: ['Prebenjamín', 'Benjamín', 'Alevín', 'Infantil', 'Aficionado'],
    required: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  colorPrincipal: {
    type: String,
    default: '#1e40af'
  },
  colorSecundario: {
    type: String,
    default: '#ffffff'
  },
  logo: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Team = mongoose.model<ITeam>('Team', teamSchema);