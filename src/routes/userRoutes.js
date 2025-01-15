import express from 'express';
import { registerUser } from '../controllers/userController.js';
import { loginUser, logout } from '../controllers/authController.js';

const userRoutes = express.Router();

//Registrar un usuario
userRoutes.post(`/register`, registerUser);

// Iniciar sesión
userRoutes.post(`/login`, loginUser);

//Cerrar Sesion
userRoutes.get(`/logout`, logout);

export default userRoutes;
