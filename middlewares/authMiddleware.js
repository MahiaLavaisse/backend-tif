const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
const token = req.header('x-auth-token');

if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
} catch (error) {
    res.status(401).json({ error: 'Token inválido' });
}
};