import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import Team from '../models/Team';

interface JwtPayload {
    id: string;
    role: string;
    teamId?: string;
}

// Extender la interfaz Request para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No está autorizado/a para acceder a esta ruta'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        ) as JwtPayload;

        req.user = {
            id: decoded.id,
            role: decoded.role,
            teamId: decoded.teamId
        } as IUser;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token no válido'
        });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'No tiene permisos para realizar esta acción'
            });
        }
        next();
    };
};

export const checkTeamAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const teamId = req.params.teamId || req.body.teamId;

        if (!teamId) {
            return res.status(400).json({
                success: false,
                error: 'ID del equipo no proporcionado'
            });
        }

        // Administrador/a principal tiene acceso a todo
        if (req.user?.role === 'admin') {
            return next();
        }

        // Administrador/a de equipo solo tiene acceso a su equipo
        if (req.user?.role === 'teamAdmin' && req.user?.teamId?.toString() !== teamId) {
            return res.status(403).json({
                success: false,
                error: 'No tiene permisos para acceder a este equipo'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const checkPlayerAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const playerId = req.params.playerId;
        const player = await Team.findOne({ 'players._id': playerId });

        if (!player) {
            return res.status(404).json({
                success: false,
                error: 'Jugador/a no encontrado/a'
            });
        }

        // Administrador/a principal tiene acceso a todo
        if (req.user?.role === 'admin') {
            return next();
        }

        // Administrador/a de equipo solo tiene acceso a jugadores/as de su equipo
        if (req.user?.role === 'teamAdmin' && req.user?.teamId?.toString() !== player.id) {
            return res.status(403).json({
                success: false,
                error: 'No tiene permisos para acceder a este/a jugador/a'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const checkMemberAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const memberId = req.params.memberId;
        const member = await Team.findOne({ 'members._id': memberId });

        if (!member) {
            return res.status(404).json({
                success: false,
                error: 'Socio/a no encontrado/a'
            });
        }

        // Administrador/a principal tiene acceso a todo
        if (req.user?.role === 'admin') {
            return next();
        }

        // Administrador/a de equipo solo tiene acceso a socios/as de su equipo
        if (req.user?.role === 'teamAdmin' && req.user?.teamId?.toString() !== member.id) {
            return res.status(403).json({
                success: false,
                error: 'No tiene permisos para acceder a este/a socio/a'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};