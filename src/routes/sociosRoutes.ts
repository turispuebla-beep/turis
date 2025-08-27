import express from 'express';
import {
    getAllSocios,
    createSocio,
    updateSocio,
    deleteSocio,
    changeSocioStatus,
    getSociosStats,
    importSocios,
    exportSocios
} from '../controllers/sociosController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas principales
router.route('/')
    .get(getAllSocios)
    .post(createSocio);

router.route('/stats')
    .get(getSociosStats);

router.route('/import')
    .post(importSocios);

router.route('/export')
    .get(exportSocios);

// Rutas para socio específico
router.route('/:id')
    .put(updateSocio)
    .delete(deleteSocio);

router.route('/:id/estado')
    .patch(changeSocioStatus);

export default router;

