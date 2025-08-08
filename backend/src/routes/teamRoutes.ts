import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    assignTeamAdmin,
    updateTeamLogo,
    getTeamStats
} from '../controllers/teamController';

// Incluir rutas de recursos relacionados
import playerRoutes from './playerRoutes';
import memberRoutes from './memberRoutes';
import eventRoutes from './eventRoutes';
import mediaRoutes from './mediaRoutes';

const router = express.Router();

// Re-enrutar a otros recursos
router.use('/:teamId/players', playerRoutes);
router.use('/:teamId/members', memberRoutes);
router.use('/:teamId/events', eventRoutes);
router.use('/:teamId/media', mediaRoutes);

// Proteger todas las rutas
router.use(protect);

// Rutas públicas (para usuarios autenticados)
router.get('/', getTeams);
router.get('/:id', getTeam);
router.get('/:id/stats', getTeamStats);

// Rutas solo para admin principal
router.use(authorize('admin'));

router.post('/', upload.single('logo'), createTeam);
router.put('/:id', upload.single('logo'), updateTeam);
router.delete('/:id', deleteTeam);
router.post('/:id/admin', assignTeamAdmin);
router.put('/:id/logo', upload.single('logo'), updateTeamLogo);

export default router;