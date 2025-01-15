import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import User from './src/models/User.js';
import mongoose from 'mongoose';

dotenv.config();

//Seeder para registar Administrador
const seedAdmin = async () => {
    try {
        // Conexión con la BD
        await connectDB();

        console.log('Conectado a la base de datos');

        const existingAdmin = await User.findOne({ email: 'admin@example.com' });

        if (existingAdmin) {
            console.log('El usuario administrador ya existe.');
            return;
        }
        const hashedPassword = await bcrypt.hash('admin123', 10); 
0
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            rol: 'admin',
        });

        await adminUser.save();

        console.log('Usuario administrador creado con éxito.');
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
