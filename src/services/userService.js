import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUserService = async ({ name, email, password }) => {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { success: false, message: 'El correo ya ha sido registrado' };
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guarda usuario en la Bd
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return { success: true, message: 'Usuario registrado con éxito' };
};


export const loginUserService = async ({ email, password }) => {
    // validar si elk email existe
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'No se encontró el usuario' };
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { success: false, message: 'Credenciales inválidas' };
    }

    // Generar token jwt
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.EXPIRES_IN }
    );
    console.log('TOkEN: ', token);
    

    return { success: true, token, user };
};