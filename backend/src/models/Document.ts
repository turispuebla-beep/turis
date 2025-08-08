import mongoose from 'mongoose';

export interface IDocument extends mongoose.Document {
    title: string;
    description: string;
    category: string;
    teamId: mongoose.Types.ObjectId;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    isPublic: boolean;
    tags: string[];
    version: number;
    downloads: number;
    status: 'active' | 'archived';
    requiredFor?: {
        type: 'player' | 'member' | 'event';
        category?: string;
    };
    validUntil?: Date;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: {
            values: [
                'formularios',
                'reglamentos',
                'autorizaciones',
                'actas',
                'contratos',
                'otros'
            ],
            message: 'Categoría no válida'
        }
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'El equipo es obligatorio']
    },
    fileUrl: {
        type: String,
        required: [true, 'La URL del archivo es obligatoria']
    },
    fileName: {
        type: String,
        required: [true, 'El nombre del archivo es obligatorio']
    },
    fileSize: {
        type: Number,
        required: [true, 'El tamaño del archivo es obligatorio']
    },
    fileType: {
        type: String,
        required: [true, 'El tipo de archivo es obligatorio'],
        enum: {
            values: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
            message: 'Tipo de archivo no válido'
        }
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    version: {
        type: Number,
        default: 1
    },
    downloads: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    requiredFor: {
        type: {
            type: String,
            enum: ['player', 'member', 'event']
        },
        category: String
    },
    validUntil: {
        type: Date,
        validate: {
            validator: function(value: Date) {
                return !value || value > new Date();
            },
            message: 'La fecha de validez debe ser posterior a la actual'
        }
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
DocumentSchema.index({ teamId: 1, category: 1 });
DocumentSchema.index({ tags: 1 });
DocumentSchema.index({ status: 1 });
DocumentSchema.index({ title: 'text', description: 'text' });

// Virtuals
DocumentSchema.virtual('isExpired').get(function(this: IDocument) {
    return this.validUntil ? this.validUntil < new Date() : false;
});

DocumentSchema.virtual('fileSizeFormatted').get(function(this: IDocument) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (this.fileSize === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(this.fileSize) / Math.log(1024)).toString());
    return Math.round(this.fileSize / Math.pow(1024, i)) + ' ' + sizes[i];
});

// Middleware
DocumentSchema.pre('save', function(next) {
    // Incrementar versión si el archivo cambia
    if (this.isModified('fileUrl')) {
        this.version += 1;
    }
    next();
});

// Métodos
DocumentSchema.methods.incrementDownloads = async function(): Promise<void> {
    this.downloads += 1;
    await this.save();
};

DocumentSchema.methods.archive = async function(): Promise<void> {
    this.status = 'archived';
    await this.save();
};

DocumentSchema.methods.isAccessibleBy = function(user: any): boolean {
    // Admin principal tiene acceso a todo
    if (user.role === 'admin') return true;

    // Admin de equipo solo tiene acceso a documentos de su equipo
    if (user.role === 'teamAdmin') {
        return this.teamId.toString() === user.teamId;
    }

    // Miembros solo tienen acceso a documentos públicos de su equipo
    return this.isPublic && this.teamId.toString() === user.teamId;
};

export default mongoose.model<IDocument>('Document', DocumentSchema);