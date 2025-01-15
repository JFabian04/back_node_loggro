import {  registerUserService } from '../services/userService.js';

//Registrar Usuario
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, rol } = req.body;
    const result = await registerUserService({ name, email, password, rol });

    if (!result.status) {
      return res.status(400).json({ status: false, errors: [{ email: result.message }] });
    }

    res.status(201).json({ status: true, message: result.message });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error: ', error: error.message });
  }
};


