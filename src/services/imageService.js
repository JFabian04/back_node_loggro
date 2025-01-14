import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import Image from '../models/Image.js';
import { convertToLocalTime, getImagesByDateRange, groupByDayAndHour, PUBLIC_URL } from '../utils/imageUtils.js';
import mongoose from 'mongoose';

const UPLOADS_FOLDER = path.join(process.cwd(), 'src', 'uploads');

export const processImageService = async ({ userId, file }) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const userFolder = path.join(UPLOADS_FOLDER, userId.toString());
  const originalFilePath = path.join(userFolder, file.filename);
  const processedFileName = `${Date.now()}_${file.originalname.replace(path.extname(file.originalname), '.png')}`;
  const processedFilePath = path.join(userFolder, processedFileName);

  // convertir la imagen a PNG
  await sharp(originalFilePath)
    .png()
    .toFile(processedFilePath);
  await fs.unlink(originalFilePath);

  // Guardar la información de la imagen en la base de datos
  const image = new Image({
    url: `${PUBLIC_URL}/${userId}/${processedFileName}`,
    uploadedBy: userId,
  });

  await image.save();

  return image;
};

//Servicio para consultar los registros por rango de fechas
export const fetchImagesWithPagination = async (query, page, limit) => {
  try {
    const sortField = query.sortBy || 'createdAt';
    const sortDirection = query.sortOrder == 'asc' ? 1 : -1;

    const filter = {};
    if (query.userId) {
      query.uploadedBy = new mongoose.Types.ObjectId(query.userId);
    }

    if (query.createdAt) {
      filter.createdAt = query.createdAt;
    }

    console.log('SERvICE QUERY: ', filter);

    const images = await Image.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'uploadedBy',
          foreignField: '_id',
          as: 'uploadedBy',
        },
      },
      { $unwind: { path: '$uploadedBy', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          createdAt: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: '$createdAt',
              timezone: 'America/Bogota',
            },
          },
        },
      },
      {
        $project: {
          url: 1,
          createdAt: 1,
          'uploadedBy.name': 1,
        },
      },
      {
        $sort: { [sortField]: sortDirection },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          images: [
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
          ],
        },
      },
    ]);

    const total = images[0]?.metadata[0]?.total || 0;
    const paginatedImages = images[0]?.images || [];
    return { total, paginatedImages };
  } catch (error) {
    throw new Error(error);
  }
};

//consultar cantidad de imagenes procedas por hora en días
export const fetchImagesGroupedByHour = async (filter) => {
  const images = await getImagesByDateRange(filter);
  const imagesWithLocalTime = convertToLocalTime(images);
  return groupByDayAndHour(imagesWithLocalTime);
};