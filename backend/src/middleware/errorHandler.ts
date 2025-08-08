import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    
    // Manejar errores específicos de MongoDB
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'Ya existe un registro con esos datos únicos'
        });
    }

    res.status(statusCode).json({
        success: false,
        error: err.message || 'Error del servidor'
    });
};

// Middleware para capturar errores asíncronos
export const asyncHandler = (fn: Function) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};