const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Iniciar sesión y obtener token
const login = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        // Validar campos requeridos
        if (!usuario || !contraseña) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        // Buscar usuario por nombre de usuario
        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id, nombre: user.nombre, rol: user.role }, // Asegúrate de que el campo 'role' sea correcto
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login };
