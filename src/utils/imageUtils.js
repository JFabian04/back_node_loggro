import moment from 'moment-timezone';
import Image from '../models/Image.js';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import mongoose from 'mongoose';

const UPLOADS_FOLDER = path.join(process.cwd(), 'src', 'uploads');

export const PUBLIC_URL = '/uploads';

// Configuración de Multer para almacenar archivos en disco
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userFolder = path.join(UPLOADS_FOLDER, req.user.id.toString());
      await fs.mkdir(userFolder, { recursive: true });
      cb(null, userFolder);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

// Middleware para manejar la carga de una sola imagen
export const uploadImageMiddleware = upload.single('image');

// Función para generar un nombre único para los archivos procesados
export const generateProcessedFileName = (originalName) =>
  `${Date.now()}_${originalName.replace(path.extname(originalName), '.png')}`;

// Función para consultar las imágenes dentro de un rango de fechas (en UTC)
export const getImagesByDateRange = async (query) => {
  try {
    const startDateUTC = moment.tz(query.startDateUTC, 'America/Bogota').startOf('day').utc().toDate();
    const endDateUTC = moment.tz(query.endDateUTC, 'America/Bogota').endOf('day').utc().toDate();
    const filter = {
      createdAt: { $gte: startDateUTC, $lte: endDateUTC }
    };

    // Validar userId
    if (query.userId) {
      filter.uploadedBy = new mongoose.Types.ObjectId(query.userId);
    }
    return await Image.find(filter);

  } catch (error) {
    throw new Error(error);
  }
};

// Función para convertir las fechas de UTC a hora local
export const convertToLocalTime = (images) => {
  return images.map(image => {
    const localDate = moment(image.createdAt).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    image.createdAtLocal = localDate;
    return image;
  });
};

// Función para agrupar las imágenes por fecha y hora local
export const groupByDayAndHour = (images) => {
  return images.reduce((acc, image) => {
    const date = moment(image.createdAtLocal).format('YYYY-MM-DD');
    const hour = moment(image.createdAtLocal).hour();

    if (!acc[date]) {
      acc[date] = [];
    }

    const hourGroup = acc[date].find(h => h.hour === hour);
    if (hourGroup) {
      hourGroup.count += 1;
    } else {
      acc[date].push({ hour, count: 1 });
    }

    return acc;
  }, {});
};
