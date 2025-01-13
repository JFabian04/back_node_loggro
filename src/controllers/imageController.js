
import moment from 'moment-timezone';
import {uploadImageMiddleware } from '../utils/imageUtils.js';
import { fetchImagesGroupedByHour, fetchImagesWithPagination, processImageService } from '../services/imageService.js';

//Cargar imagen 
export const uploadImage = async (req, res) => {
  try {
    uploadImageMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }

      try {
        const userId = req.user.id;
        const image = await processImageService({ userId, file: req.file });

        res.status(200).json({ message: 'Image uploaded and processed successfully', image });
      } catch (error) {
        res.status(500).json({ message: 'Error processing the image', error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// consultar imágenes (Rango de fecha)
export const getImagesByDate = async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10, ...filters } = req.query;

  try {
    const dateQuery = {};
    if (startDate && endDate) {
      const startDateUTC = moment.tz(startDate, 'America/Bogota').startOf('day').utc().toDate();
      const endDateUTC = moment.tz(endDate, 'America/Bogota').endOf('day').utc().toDate();
      dateQuery.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
      console.log('DATE QUERY:', startDateUTC, endDateUTC);
    }
    const query = { ...filters, ...dateQuery };

    const { total, paginatedImages } = await fetchImagesWithPagination(query, page, limit);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      images: paginatedImages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
};

//Obtener cantidad de imagens por hora
export const getImageByHour = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Validar fechas
  const validStartDate = new Date(startDate);
  const validEndDate = new Date(endDate);

  if (isNaN(validStartDate.getTime()) || isNaN(validEndDate.getTime())) {
    return res.status(400).json({ message: 'Formato de fechas inválido' });
  }

  try {
    const startDateUTC = moment.utc(startDate).startOf('day').toDate();
    const endDateUTC = moment.utc(endDate).endOf('day').toDate();

    const groupedByDayAndHour = await fetchImagesGroupedByHour(startDateUTC, endDateUTC);

    res.status(200).json({ groupedByDayAndHour });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las imágenes por fecha y hora', error: error.message });
  }
};