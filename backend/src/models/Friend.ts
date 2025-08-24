import mongoose, { Document, Schema } from 'mongoose';

export interface IFriend extends Document {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  fechaRegistro: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const friendSchema = new Schema<IFriend>({
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Friend = mongoose.model<IFriend>('Friend', friendSchema);