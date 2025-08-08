import mongoose, { Document } from 'mongoose';

export interface IMedia extends Document {
    type: 'photo' | 'video';
    url: string;
    description?: string;
    uploadDate: Date;
    teamId: mongoose.Types.ObjectId;
    fileSize: number;
    fileName: string;
    mimeType: string;
}

const mediaSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['photo', 'video'],
        required: [true, 'El tipo de medio es obligatorio']
    },
    url: {
        type: String,
        required: [true, 'La URL es obligatoria']
    },
    description: String,
    uploadDate: {
        type: Date,
        default: Date.now
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo es obligatorio']
    },
    fileSize: {
        type: Number,
        required: [true, 'El tamaño del archivo es obligatorio']
    },
    fileName: {
        type: String,
        required: [true, 'El nombre del archivo es obligatorio']
    },
    mimeType: {
        type: String,
        required: [true, 'El tipo MIME es obligatorio']
    }
}, {
    timestamps: true
});

// Validación de tamaño de archivo
mediaSchema.pre('save', function(next) {
    const maxSize = this.type === 'photo' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB para fotos, 50MB para videos
    
    if (this.fileSize > maxSize) {
        const error = new Error(`El archivo excede el tamaño máximo permitido (${maxSize / (1024 * 1024)}MB)`);
        return next(error);
    }

    // Validar tipo MIME
    const allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm'];
    
    if (this.type === 'photo' && !allowedPhotoTypes.includes(this.mimeType)) {
        const error = new Error('Formato de imagen no válido');
        return next(error);
    }

    if (this.type === 'video' && !allowedVideoTypes.includes(this.mimeType)) {
        const error = new Error('Formato de video no válido');
        return next(error);
    }

    next();
});

export default mongoose.model<IMedia>('Media', mediaSchema);