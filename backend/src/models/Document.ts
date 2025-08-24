import mongoose, { Schema } from 'mongoose';

export interface IDocument extends mongoose.Document {
  titulo: string;
  descripcion?: string;
  url: string;
  tipo: 'pdf' | 'doc' | 'docx';
  subidoPor: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['pdf', 'doc', 'docx'],
    default: 'pdf'
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

export const Document = mongoose.model<IDocument>('Document', documentSchema);