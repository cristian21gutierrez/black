const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protegerRuta = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Aquí verificas al usuario

        console.log('Usuario autenticado:', req.user);

        if (!req.user) {
            return res.status(401).json({ message: 'Acceso denegado. Usuario no encontrado' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ message: 'Acceso denegado. Token inválido' });
    }
};


// Middleware para verificar si el usuario es admin
const verificarAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. No eres administrador' });
    }
    next();
};

module.exports = { protegerRuta, verificarAdmin };
