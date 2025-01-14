import express from 'express';
import { uploadImage, getImagesByDate, getImageByHour } from '../controllers/imageController.js';
import { authenticateToken } from '../middelwares/auth.js';

const imageRoutes = express.Router();

// Subir imagenes
imageRoutes.post(`/upload`, authenticateToken, uploadImage);

// consultar imagenes (fecha / hora)
imageRoutes.get('/by-date', authenticateToken, getImagesByDate);
imageRoutes.get('/by-hour', authenticateToken, getImageByHour);

export default imageRoutes;
