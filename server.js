import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './src/routes/router.js';
import connectDB from './src/config/database.js';
import cors from 'cors';
import path from 'path'

dotenv.config();

const app = express();

//Cors
const corsOptions = {
  // origin: (origin, callback) => {
  //   //Oringenes dinamicos con credentials
  //   if (!origin || origin === 'http://localhost:5173') {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('No permitido por CORS'));
  //   }
  // },
  origin: process.env.REACT_DOMAIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

//Ruta estatica para archivos
app.use('/uploads', express.static(path.join('src', 'uploads')));

// Conectar con MongoDB
connectDB();
// Rutas
app.use('/api', router);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto: ${PORT}`);
});
