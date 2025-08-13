import express from 'express';
import {
    exportPlayers,
    exportMembers,
    exportFriends,
    exportTeams
} from '../controllers/exportController';
import { protect, authorize, checkTeamAccess } from '../middleware/auth';

const router = express.Router();

// Proteger todas las rutas
router.use(protect);

// Rutas para exportar datos de un equipo específico
router.get('/teams/:teamId/players', checkTeamAccess, exportPlayers);
router.get('/teams/:teamId/members', checkTeamAccess, exportMembers);
router.get('/teams/:teamId/friends', checkTeamAccess, exportFriends);

// Rutas para exportar todos los datos (solo admin)
router.get('/players', authorize('admin'), exportPlayers);
router.get('/members', authorize('admin'), exportMembers);
router.get('/friends', authorize('admin'), exportFriends);
router.get('/teams', authorize('admin'), exportTeams);

export default router;