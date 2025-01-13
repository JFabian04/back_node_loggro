import jwt from 'jsonwebtoken';

//Middelware para protecion de rutas
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(403).json({auth: false, status: false, message: 'Acesso denegado'});

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({auth: false, status: false, message: 'Token Invalido'});
    req.user = user;
    next();
  });
};
