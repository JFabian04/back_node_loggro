import { loginUserService, registerUserService } from '../services/userService.js';

//Registrar Usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, rol } = req.body;
    const result = await registerUserService({ name, email, password, rol });

    if (!result.success) {
      return res.status(400).json({ status: false, errors: [{ email: result.message }] });
    }

    res.status(201).json({ status: true, message: result.message });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error: ', error: error.message });
  }
};

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

    res.status(200).json({ status: true, data: { accessToken: result.token } });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
  }
};
