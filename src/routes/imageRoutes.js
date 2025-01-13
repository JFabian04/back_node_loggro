import express from 'express';
import { uploadImage, getImagesByDate, getImageByHour } from '../controllers/imageController.js';
import { authenticateToken } from '../middelwares/auth.js';

const imageRoutes = express.Router();

// Subir imagenes
imageRoutes.post(`/upload`, authenticateToken, uploadImage);

// consultar imagenes (fecha / hora)
imageRoutes.get('/by-date', getImagesByDate);
imageRoutes.get('/by-hour', getImageByHour);

export default imageRoutes;
