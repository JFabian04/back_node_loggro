import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const userRoutes = express.Router();

//Registrar un usuario
userRoutes.post(`/register`, registerUser);

// Iniciar sesión
userRoutes.post(`/login`, loginUser);

export default userRoutes;
