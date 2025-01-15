import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUserService = async ({ name, email, rol, password }) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { status: false, message: 'El correo ya ha sido registrado' };
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guarda usuario en la Bd
        const user = new User({ name, email, rol, password: hashedPassword });
        await user.save();

        return { status: true, message: 'Usuario registrado con éxito' };
    } catch (error) {
        throw new Error(error)
    }
};


export const loginUserService = async ({ email, password }) => {
    try {
        // validar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return { status: false, message: 'No se encontró el usuario' };
        }

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { status: false, message: 'Credenciales inválidas' };
        }

        // Generar token jwt
        const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_IN }
        );
        console.log('TOkEN: ', token);
        return { status: true, token, user };

    } catch (error) {
        throw new Error(error)
    }
};
