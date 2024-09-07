const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir el esquema de usuario
const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true // Asegúrate de que el campo correo sea único
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

// Encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
    if (!this.isModified('contraseña')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.contraseña = await bcrypt.hash(this.contraseña, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Comparar contraseñas
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.contraseña);
};

// Crear el modelo de usuario
const User = mongoose.model('User', UserSchema);

module.exports = User;
