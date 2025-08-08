import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
    getMatches,
    getMatch,
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchStats
} from '../controllers/matchController';

const router = express.Router({ mergeParams: true });

// Proteger todas las rutas
router.use(protect);

// Rutas públicas (para usuarios autenticados)
router.get('/', getMatches);
router.get('/stats', getMatchStats);
router.get('/:id', getMatch);

// Rutas solo para administradores de equipo y admin principal
router.use(authorize('admin', 'teamAdmin'));

router.post('/',
    upload.fields([
        { name: 'photos', maxCount: 10 },
        { name: 'videos', maxCount: 2 }
    ]),
    createMatch
);

router.put('/:id',
    upload.fields([
        { name: 'photos', maxCount: 10 },
        { name: 'videos', maxCount: 2 }
    ]),
    updateMatch
);

router.delete('/:id', deleteMatch);

export default router;