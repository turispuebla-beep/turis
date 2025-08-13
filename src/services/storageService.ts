import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import crypto from 'crypto';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

interface FileDetails {
    originalName: string;
    mimeType: string;
    size: number;
    buffer: Buffer;
}

class StorageService {
    private baseDir: string;
    private allowedImageTypes: string[];
    private allowedVideoTypes: string[];
    private allowedDocTypes: string[];
    private maxSizes: {
        image: number;
        video: number;
        document: number;
    };

    constructor() {
        this.baseDir = process.env.UPLOAD_PATH || 'uploads';
        this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        this.allowedVideoTypes = ['video/mp4', 'video/webm'];
        this.allowedDocTypes = ['application/pdf'];
        this.maxSizes = {
            image: 5 * 1024 * 1024, // 5MB
            video: 50 * 1024 * 1024, // 50MB
            document: 10 * 1024 * 1024 // 10MB
        };

        // Crear directorios necesarios
        this.initializeDirectories();
    }

    private async initializeDirectories() {
        const dirs = [
            this.baseDir,
            path.join(this.baseDir, 'photos'),
            path.join(this.baseDir, 'videos'),
            path.join(this.baseDir, 'documents'),
            path.join(this.baseDir, 'logos'),
            path.join(this.baseDir, 'exports'),
            path.join(this.baseDir, 'temp')
        ];

        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                await mkdir(dir, { recursive: true });
            }
        }
    }

    private generateUniqueFileName(originalName: string): string {
        const timestamp = Date.now();
        const random = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(originalName);
        return `${timestamp}-${random}${ext}`;
    }

    private validateFile(file: FileDetails, type: 'image' | 'video' | 'document'): void {
        let allowedTypes: string[];
        let maxSize: number;

        switch (type) {
            case 'image':
                allowedTypes = this.allowedImageTypes;
                maxSize = this.maxSizes.image;
                break;
            case 'video':
                allowedTypes = this.allowedVideoTypes;
                maxSize = this.maxSizes.video;
                break;
            case 'document':
                allowedTypes = this.allowedDocTypes;
                maxSize = this.maxSizes.document;
                break;
        }

        if (!allowedTypes.includes(file.mimeType)) {
            throw new Error(`Tipo de archivo no permitido. Use: ${allowedTypes.join(', ')}`);
        }

        if (file.size > maxSize) {
            throw new Error(`El archivo excede el tamaño máximo permitido de ${maxSize / (1024 * 1024)}MB`);
        }
    }

    public async saveFile(
        file: FileDetails,
        type: 'image' | 'video' | 'document',
        subDirectory?: string
    ): Promise<{ fileName: string; filePath: string }> {
        // Validar archivo
        this.validateFile(file, type);

        // Determinar directorio
        const targetDir = subDirectory 
            ? path.join(this.baseDir, subDirectory)
            : path.join(this.baseDir, type === 'image' ? 'photos' : type === 'video' ? 'videos' : 'documents');

        // Generar nombre único
        const fileName = this.generateUniqueFileName(file.originalName);
        const filePath = path.join(targetDir, fileName);

        // Guardar archivo
        await writeFile(filePath, file.buffer);

        return {
            fileName,
            filePath
        };
    }

    public async deleteFile(filePath: string): Promise<void> {
        if (fs.existsSync(filePath)) {
            await unlink(filePath);
        }
    }

    public async moveFile(oldPath: string, newPath: string): Promise<void> {
        if (fs.existsSync(oldPath)) {
            await fs.promises.rename(oldPath, newPath);
        }
    }

    public getFilePath(fileName: string, type: 'image' | 'video' | 'document' | 'logo' | 'export'): string {
        let directory: string;
        switch (type) {
            case 'image':
                directory = 'photos';
                break;
            case 'video':
                directory = 'videos';
                break;
            case 'document':
                directory = 'documents';
                break;
            case 'logo':
                directory = 'logos';
                break;
            case 'export':
                directory = 'exports';
                break;
        }
        return path.join(this.baseDir, directory, fileName);
    }

    public async createTempFile(
        data: Buffer | string,
        extension: string
    ): Promise<string> {
        const fileName = this.generateUniqueFileName(`temp${extension}`);
        const filePath = path.join(this.baseDir, 'temp', fileName);
        
        await writeFile(filePath, data);
        
        return filePath;
    }

    public async cleanupTempFiles(): Promise<void> {
        const tempDir = path.join(this.baseDir, 'temp');
        const files = await fs.promises.readdir(tempDir);
        
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.promises.stat(filePath);
            
            if (stats.ctimeMs < oneHourAgo) {
                await this.deleteFile(filePath);
            }
        }
    }
}

export const storageService = new StorageService();