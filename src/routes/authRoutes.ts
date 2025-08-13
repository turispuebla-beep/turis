import express from 'express';
import {
    registerTeamAdmin,
    login,
    getMe,
    updatePassword
} from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/register', protect, authorize('admin'), registerTeamAdmin);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

export default router;