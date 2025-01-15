import jwt from 'jsonwebtoken';

//Middleware para protección de rutas (funciona como endpoint)
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ auth: false, status: false, message: 'Acceso denegado' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ auth: false, status: false, message: 'Token Inválido' });
    req.user = user;
    next(); 
  });
};
