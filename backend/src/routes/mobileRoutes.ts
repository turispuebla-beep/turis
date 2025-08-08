import express from 'express';
import { protect } from '../middleware/auth';
import {
    mobileLogin,
    updateDeviceToken
} from '../controllers/mobileAuthController';
import {
    syncData,
    getOptimizedMedia
} from '../controllers/mobileSyncController';

const router = express.Router();

// Rutas de autenticación móvil
router.post('/auth/login', mobileLogin);
router.put('/auth/device-token', protect, updateDeviceToken);

// Rutas de sincronización
router.get('/sync', protect, syncData);
router.get('/media/:id', protect, getOptimizedMedia);

export default router;