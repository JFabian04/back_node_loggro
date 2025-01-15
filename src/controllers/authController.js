import { loginUserService } from "../services/userService.js";

//Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUserService({ email, password });

        if (!result.status) {
            return res.status(400).json({ status: false, message: result.message });
        }

        // Configuracion de cookie con el token
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ status: true, data: { accessToken: result.token, rol: result.user.rol  } });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
    }
};

//Logut Sesion
export const logout = async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(400).json({ status: false, message: 'No hay sesión activa' });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ status: true, message: 'Sesión Cerrada' });

    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
    }
}