const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Token não fornecido');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.id, email: decodedToken.email, tipo: decodedToken.tipo };
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).send('Token inválido');
  }
};

module.exports = authMiddleware;
