import express from 'express';
import userRoutes from './userRoutes.js';
import imageRoutes from './imageRoutes.js';
import { authenticateToken } from '../middelwares/auth.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/images', imageRoutes);

//Funcion para validar sesion
router.get('/auth/protected', authenticateToken, (req, res) => {
    res.json({status: true, message: 'Ruta protegida', user: req.user });
});

export default router;
