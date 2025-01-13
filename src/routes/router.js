import express from 'express';
import userRoutes from './userRoutes.js';
import imageRoutes from './imageRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/images', imageRoutes);

export default router;
