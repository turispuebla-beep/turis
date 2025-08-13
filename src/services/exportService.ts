import Excel from 'exceljs';
import { Types } from 'mongoose';
import Player from '../models/Player';
import Member from '../models/Member';
import Team from '../models/Team';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export class ExportService {
    private static async createWorkbook(): Promise<Excel.Workbook> {
        const workbook = new Excel.Workbook();
        workbook.creator = 'Club de Fútbol';
        workbook.created = new Date();
        return workbook;
    }

    private static styleHeader(worksheet: Excel.Worksheet): void {
        const headerRow = worksheet.getRow(1);
        headerRow.font = {
            bold: true,
            color: { argb: 'FFFFFF' }
        };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2196F3' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    }

    public static async exportPlayers(teamId?: string, category?: string): Promise<Buffer> {
        const workbook = await this.createWorkbook();
        const worksheet = workbook.addWorksheet('Jugadores');

        // Definir columnas
        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 20 },
            { header: 'Apellidos', key: 'surname', width: 25 },
            { header: 'DNI', key: 'dni', width: 15 },
            { header: 'Género', key: 'gender', width: 12 },
            { header: 'Fecha Nacimiento', key: 'birthDate', width: 15 },
            { header: 'Edad', key: 'age', width: 10 },
            { header: 'Teléfono', key: 'phone', width: 15 },
            { header: 'Categoría', key: 'category', width: 15 },
            { header: 'Tutor/a 1', key: 'guardian1', width: 30 },
            { header: 'DNI Tutor/a 1', key: 'guardian1Dni', width: 15 },
            { header: 'Teléfono Tutor/a 1', key: 'guardian1Phone', width: 15 },
            { header: 'Email Tutor/a 1', key: 'guardian1Email', width: 25 },
            { header: 'Tutor/a 2', key: 'guardian2', width: 30 },
            { header: 'DNI Tutor/a 2', key: 'guardian2Dni', width: 15 },
            { header: 'Teléfono Tutor/a 2', key: 'guardian2Phone', width: 15 },
            { header: 'Email Tutor/a 2', key: 'guardian2Email', width: 25 },
            { header: 'Consentimiento Fotos', key: 'photoConsent', width: 15 },
            { header: 'Consentimiento Equipo', key: 'teamConsent', width: 15 }
        ];

        // Estilo para el encabezado
        this.styleHeader(worksheet);

        // Construir query
        const query: any = {};
        if (teamId) query.teamId = teamId;
        if (category) {
            const teams = await Team.find({ category });
            query.teamId = { $in: teams.map(t => t._id) };
        }

        // Obtener jugadores
        const players = await Player.find(query).populate('teamId');

        // Añadir datos
        players.forEach(player => {
            worksheet.addRow({
                name: player.name,
                surname: player.surname,
                dni: player.dni,
                gender: player.gender === 'masculino' ? 'Masculino' : 'Femenino',
                birthDate: format(new Date(player.birthDate), 'dd/MM/yyyy'),
                age: player.age,
                phone: player.phone,
                category: (player.teamId as any).category,
                guardian1: player.guardianInfo?.[0]?.name || '',
                guardian1Dni: player.guardianInfo?.[0]?.dni || '',
                guardian1Phone: player.guardianInfo?.[0]?.phone || '',
                guardian1Email: player.guardianInfo?.[0]?.email || '',
                guardian2: player.guardianInfo?.[1]?.name || '',
                guardian2Dni: player.guardianInfo?.[1]?.dni || '',
                guardian2Phone: player.guardianInfo?.[1]?.phone || '',
                guardian2Email: player.guardianInfo?.[1]?.email || '',
                photoConsent: player.photoConsent ? 'Sí' : 'No',
                teamConsent: player.teamConsent ? 'Sí' : 'No'
            });
        });

        // Formato condicional para consentimientos
        worksheet.addConditionalFormatting({
            ref: 'Q2:R1000',
            rules: [
                {
                    type: 'cellIs',
                    operator: 'equal',
                    formulae: ['"Sí"'],
                    style: {
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            bgColor: { argb: 'C8E6C9' }
                        }
                    }
                },
                {
                    type: 'cellIs',
                    operator: 'equal',
                    formulae: ['"No"'],
                    style: {
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            bgColor: { argb: 'FFCDD2' }
                        }
                    }
                }
            ]
        });

        return await workbook.xlsx.writeBuffer();
    }

    public static async exportMembers(teamId?: string, status?: string): Promise<Buffer> {
        const workbook = await this.createWorkbook();
        const worksheet = workbook.addWorksheet('Socios');

        // Definir columnas
        worksheet.columns = [
            { header: 'Número', key: 'memberNumber', width: 10 },
            { header: 'Nombre', key: 'name', width: 20 },
            { header: 'Apellidos', key: 'surname', width: 25 },
            { header: 'DNI', key: 'dni', width: 15 },
            { header: 'Género', key: 'gender', width: 12 },
            { header: 'Teléfono', key: 'phone', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Estado', key: 'status', width: 15 },
            { header: 'Fecha Registro', key: 'registrationDate', width: 15 },
            { header: 'Equipo', key: 'team', width: 20 }
        ];

        // Estilo para el encabezado
        this.styleHeader(worksheet);

        // Construir query
        const query: any = {};
        if (teamId) query.teamId = teamId;
        if (status) query.status = status;

        // Obtener socios
        const members = await Member.find(query).populate('teamId');

        // Añadir datos
        members.forEach(member => {
            worksheet.addRow({
                memberNumber: member.memberNumber,
                name: member.name,
                surname: member.surname,
                dni: member.dni,
                gender: member.gender === 'masculino' ? 'Masculino' : 'Femenino',
                phone: member.phone,
                email: member.email,
                status: member.status === 'active' ? 'Activo' : 'Pendiente',
                registrationDate: format(new Date(member.registrationDate), 'dd/MM/yyyy'),
                team: (member.teamId as any).name
            });
        });

        // Formato condicional para estado
        worksheet.addConditionalFormatting({
            ref: 'H2:H1000',
            rules: [
                {
                    type: 'cellIs',
                    operator: 'equal',
                    formulae: ['"Activo"'],
                    style: {
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            bgColor: { argb: 'C8E6C9' }
                        }
                    }
                },
                {
                    type: 'cellIs',
                    operator: 'equal',
                    formulae: ['"Pendiente"'],
                    style: {
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            bgColor: { argb: 'FFF9C4' }
                        }
                    }
                }
            ]
        });

        return await workbook.xlsx.writeBuffer();
    }

    public static async exportTeams(): Promise<Buffer> {
        const workbook = await this.createWorkbook();
        const worksheet = workbook.addWorksheet('Equipos');

        // Definir columnas
        worksheet.columns = [
            { header: 'Nombre', key: 'name', width: 25 },
            { header: 'Categoría', key: 'category', width: 15 },
            { header: 'Admin. Nombre', key: 'adminName', width: 25 },
            { header: 'Admin. Email', key: 'adminEmail', width: 25 },
            { header: 'Admin. Teléfono', key: 'adminPhone', width: 15 },
            { header: 'Jugadores', key: 'playerCount', width: 10 },
            { header: 'Socios', key: 'memberCount', width: 10 },
            { header: 'Email Contacto', key: 'contactEmail', width: 25 },
            { header: 'Teléfono Contacto', key: 'contactPhone', width: 15 }
        ];

        // Estilo para el encabezado
        this.styleHeader(worksheet);

        // Obtener equipos con conteos
        const teams = await Team.aggregate([
            {
                $lookup: {
                    from: 'players',
                    localField: '_id',
                    foreignField: 'teamId',
                    as: 'players'
                }
            },
            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'teamId',
                    as: 'members'
                }
            },
            {
                $project: {
                    name: 1,
                    category: 1,
                    admin: 1,
                    contactInfo: 1,
                    playerCount: { $size: '$players' },
                    memberCount: {
                        $size: {
                            $filter: {
                                input: '$members',
                                as: 'member',
                                cond: { $eq: ['$$member.status', 'active'] }
                            }
                        }
                    }
                }
            }
        ]);

        // Añadir datos
        teams.forEach(team => {
            worksheet.addRow({
                name: team.name,
                category: team.category,
                adminName: team.admin.name,
                adminEmail: team.admin.email,
                adminPhone: team.admin.phone,
                playerCount: team.playerCount,
                memberCount: team.memberCount,
                contactEmail: team.contactInfo.email,
                contactPhone: team.contactInfo.phone
            });
        });

        // Formato condicional para conteos
        worksheet.addConditionalFormatting({
            ref: 'F2:G1000',
            rules: [
                {
                    type: 'cellIs',
                    operator: 'greaterThan',
                    formulae: ['0'],
                    style: {
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            bgColor: { argb: 'C8E6C9' }
                        }
                    }
                },
                {
                    type: 'cellIs',
                    operator: 'equal',
                    formulae: ['0'],
                    style: {
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            bgColor: { argb: 'FFCDD2' }
                        }
                    }
                }
            ]
        });

        return await workbook.xlsx.writeBuffer();
    }

    public static async exportTeamStats(teamId: string): Promise<Buffer> {
        const workbook = await this.createWorkbook();
        
        // Hoja de Jugadores
        const playersSheet = workbook.addWorksheet('Estadísticas Jugadores');
        playersSheet.columns = [
            { header: 'Nombre', key: 'name', width: 20 },
            { header: 'Apellidos', key: 'surname', width: 25 },
            { header: 'Partidos', key: 'matches', width: 10 },
            { header: 'Goles', key: 'goals', width: 10 },
            { header: 'Asistencias', key: 'assists', width: 10 },
            { header: 'T. Amarillas', key: 'yellowCards', width: 12 },
            { header: 'T. Rojas', key: 'redCards', width: 10 },
            { header: 'Minutos', key: 'minutes', width: 10 }
        ];
        this.styleHeader(playersSheet);

        // Obtener estadísticas de jugadores
        const playerStats = await Player.aggregate([
            {
                $match: { teamId: new Types.ObjectId(teamId) }
            },
            {
                $lookup: {
                    from: 'matches',
                    localField: '_id',
                    foreignField: 'players.playerId',
                    as: 'matches'
                }
            },
            {
                $project: {
                    name: 1,
                    surname: 1,
                    matches: { $size: '$matches' },
                    stats: {
                        $reduce: {
                            input: '$matches',
                            initialValue: {
                                goals: 0,
                                assists: 0,
                                yellowCards: 0,
                                redCards: 0,
                                minutes: 0
                            },
                            in: {
                                goals: { $add: ['$$value.goals', '$$this.goals'] },
                                assists: { $add: ['$$value.assists', '$$this.assists'] },
                                yellowCards: { $add: ['$$value.yellowCards', '$$this.yellowCards'] },
                                redCards: { $add: ['$$value.redCards', { $cond: ['$$this.redCard', 1, 0] }] },
                                minutes: { $add: ['$$value.minutes', '$$this.minutesPlayed'] }
                            }
                        }
                    }
                }
            }
        ]);

        playerStats.forEach(player => {
            playersSheet.addRow({
                name: player.name,
                surname: player.surname,
                matches: player.matches,
                goals: player.stats.goals,
                assists: player.stats.assists,
                yellowCards: player.stats.yellowCards,
                redCards: player.stats.redCards,
                minutes: player.stats.minutes
            });
        });

        return await workbook.xlsx.writeBuffer();
    }
}