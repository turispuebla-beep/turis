import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  titulo: string;
  descripcion?: string;
  tipo: 'foto' | 'video';
  url: string;
  equipoId?: mongoose.Types.ObjectId;
  eventoId?: mongoose.Types.ObjectId;
  subidoPor: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['foto', 'video'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  equipoId: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  eventoId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  subidoPor: {
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

export const Media = mongoose.model<IMedia>('Media', mediaSchema);