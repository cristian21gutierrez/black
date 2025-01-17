const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
    },
    categoria: {
        type: String,
        enum: ['bebida', 'comida'],
        required: true,
    },
    imagen: {
        type: String,
        required: false, 
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);

