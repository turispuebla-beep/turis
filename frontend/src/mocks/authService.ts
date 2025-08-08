import { mockUsers } from './users';
import { 
    SUPER_ADMIN_EMAIL, 
    SUPER_ADMIN_PASSWORD,
    UserRole,
    TeamAccess
} from '../types/auth';

// Simula un retraso en la respuesta
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Almacena los códigos de acceso generados
const accessCodes = new Map<string, {
    teamId: string;
    role: UserRole;
    createdBy: string;
    createdAt: string;
    expiresAt: string;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
}>();

// Almacena los accesos a equipos
const teamAccesses = new Map<string, TeamAccess[]>(); // userId -> TeamAccess[]

export const mockAuthService = {
    async login(email: string, password: string) {
        await delay(1000);

        // Verificar super admin
        if (email === SUPER_ADMIN_EMAIL) {
            if (password !== SUPER_ADMIN_PASSWORD) {
                throw new Error('Credenciales inválidas');
            }

            const token = btoa(JSON.stringify({
                userId: 'super_admin',
                email: SUPER_ADMIN_EMAIL,
                role: 'super_admin',
                exp: Date.now() + 3600000
            }));

            return {
                user: {
                    id: 'super_admin',
                    email: SUPER_ADMIN_EMAIL,
                    name: 'Administrador Principal',
                    role: 'super_admin' as UserRole,
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z'
                },
                tokens: {
                    accessToken: token,
                    refreshToken: `refresh_${token}`,
                    expiresIn: 3600
                }
            };
        }

        // Verificar otros usuarios
        const user = mockUsers.find(u => u.email === email);
        if (!user || user.password !== password) {
            throw new Error('Credenciales inválidas');
        }

        const token = btoa(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 3600000
        }));

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                teamAccess: teamAccesses.get(user.id),
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                lastLogin: new Date().toISOString()
            },
            tokens: {
                accessToken: token,
                refreshToken: `refresh_${token}`,
                expiresIn: 3600
            }
        };
    },

    async register(data: {
        email: string;
        password: string;
        name: string;
        teamAccessCode?: string;
    }) {
        await delay(1000);

        // No permitir registro como super admin
        if (data.email === SUPER_ADMIN_EMAIL) {
            throw new Error('Email no disponible');
        }

        // Validar que el email no exista
        if (mockUsers.some(u => u.email === data.email)) {
            throw new Error('El email ya está registrado');
        }

        // Validar contraseña
        if (data.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        let role: UserRole = 'viewer';
        let userTeamAccess: TeamAccess[] = [];

        // Verificar código de acceso si se proporciona
        if (data.teamAccessCode) {
            const accessCode = accessCodes.get(data.teamAccessCode);
            if (!accessCode) {
                throw new Error('Código de acceso inválido');
            }

            if (!accessCode.isActive) {
                throw new Error('Código de acceso expirado o inactivo');
            }

            if (accessCode.usedCount >= accessCode.maxUses) {
                throw new Error('Código de acceso agotado');
            }

            if (new Date(accessCode.expiresAt) < new Date()) {
                throw new Error('Código de acceso expirado');
            }

            // Asignar rol y acceso al equipo
            role = accessCode.role;
            userTeamAccess = [{
                teamId: accessCode.teamId,
                accessCode: data.teamAccessCode,
                role: accessCode.role
            }];

            // Incrementar contador de uso
            accessCode.usedCount++;
        }

        // Crear nuevo usuario
        const newUser = {
            id: String(mockUsers.length + 1),
            email: data.email,
            password: data.password,
            name: data.name,
            role
        };

        mockUsers.push(newUser);

        // Guardar accesos a equipos
        if (userTeamAccess.length > 0) {
            teamAccesses.set(newUser.id, userTeamAccess);
        }

        const token = btoa(JSON.stringify({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
            exp: Date.now() + 3600000
        }));

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                teamAccess: userTeamAccess,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            tokens: {
                accessToken: token,
                refreshToken: `refresh_${token}`,
                expiresIn: 3600
            }
        };
    },

    async generateAccessCode(options: {
        teamId: string;
        role: UserRole;
        expiresIn?: number;
        maxUses?: number;
    }) {
        await delay(500);

        const code = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (options.expiresIn || 7));

        accessCodes.set(code, {
            teamId: options.teamId,
            role: options.role,
            createdBy: SUPER_ADMIN_EMAIL,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            maxUses: options.maxUses || 1,
            usedCount: 0,
            isActive: true
        });

        return {
            code,
            ...accessCodes.get(code)
        };
    },

    async verifyAccessCode(code: string) {
        await delay(300);

        const accessCode = accessCodes.get(code);
        if (!accessCode) {
            return {
                isValid: false,
                error: 'Código no encontrado'
            };
        }

        if (!accessCode.isActive) {
            return {
                isValid: false,
                error: 'Código inactivo'
            };
        }

        if (accessCode.usedCount >= accessCode.maxUses) {
            return {
                isValid: false,
                error: 'Código agotado'
            };
        }

        if (new Date(accessCode.expiresAt) < new Date()) {
            return {
                isValid: false,
                error: 'Código expirado'
            };
        }

        return {
            isValid: true,
            teamAccess: {
                teamId: accessCode.teamId,
                accessCode: code,
                role: accessCode.role
            }
        };
    },

    async revokeAccessCode(code: string) {
        await delay(300);

        const accessCode = accessCodes.get(code);
        if (accessCode) {
            accessCode.isActive = false;
        }
    },

    async getAccessCodes(teamId?: string) {
        await delay(500);

        const codes = Array.from(accessCodes.entries()).map(([code, data]) => ({
            code,
            ...data
        }));

        if (teamId) {
            return codes.filter(code => code.teamId === teamId);
        }

        return codes;
    }
};