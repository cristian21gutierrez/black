const User = require('../models/User');


const createUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, usuario, contraseña, role } = req.body;

       
        if (!nombre || !apellido || !correo || !usuario || !contraseña) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        
        const existingUser = await User.findOne({ usuario });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        
        const existingEmail = await User.findOne({ correo });
        if (existingEmail) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }

        
        const newUser = new User({ nombre, apellido, correo, usuario, contraseña, role: role || 'user' });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear usuario:', error); 
        res.status(500).json({ message: 'Error al crear usuario', error });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};


const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ usuario: username });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el usuario', error });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByUsername,
    updateUser,
    deleteUser,
};
