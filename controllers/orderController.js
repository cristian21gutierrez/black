const Order = require('../models/Order');
const mongoose = require('mongoose');


// Crear un nuevo pedido
const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; 
        
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear nuevo pedido con el estado inicial correcto
        const newOrder = new Order({
            userId,
            productId,
            quantity,
            status: 'pendiente', 
        });
        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: 'Error al crear pedido', error });
    }
};

// Obtener todos los pedidos (admin)
const getAllOrders = async (req, res) => {
    try {
        
        const orders = await Order.find()
            .populate('userId', 'nombre')  
            .populate('productId', 'nombre');  

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos', error });
    }
};

// Obtener un pedido por ID (admin o el mismo usuario)
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params; 

        // Intentar buscar el pedido por ID
        const order = await Order.findById(id)
            .populate('userId', 'nombre') 
            .populate('productId', 'nombre');

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (req.user.role !== 'admin' && req.user._id.toString() !== order.userId._id.toString()) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para ver este pedido.' });
        }

        res.json(order); 
    } catch (error) {
        console.error('Error al buscar el pedido:', error);
        res.status(500).json({ message: 'Error al buscar el pedido', error: error.message });
    }
};


// Actualizar el estado de un pedido (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar pedido' });
    }
};


// Eliminar un pedido (admin)
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar pedido' });
    }
};

// Obtener los pedidos del usuario autenticado
const getUserOrders = async (req, res) => {
    try {
        // Verificar si req.user está definido
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const userId = req.user._id;

        // Validar si el ID del usuario es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido.' });
        }

        // Buscar los pedidos del usuario
        const orders = await Order.find({ userId }).populate('productId');

        // Comprobar si se encontraron pedidos
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este usuario.' });
        }

        // Devolver los pedidos encontrados
        res.json(orders);
    } catch (error) {
        console.error('Error al buscar los pedidos del usuario:', error);
        res.status(500).json({ message: 'Error al buscar los pedidos del usuario', error: error.message });
    }
};





const editUserOrder = async (req, res) => {
    try {
        const { id } = req.params; // ID del pedido
        const { quantity, status } = req.body; // Campos que pueden ser actualizados

        // Verificar si el pedido pertenece al usuario autenticado
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar este pedido' });
        }

        // Actualizar el pedido
        if (quantity) order.quantity = quantity;
        if (status) order.status = status; // Opcionalmente permitir actualización de estado
        await order.save();

        res.json({ message: 'Pedido actualizado', order });
    } catch (error) {
        console.error('Error al editar el pedido:', error);
        res.status(500).json({ message: 'Error al editar el pedido', error: error.message });
    }
};

const deleteUserOrder = async (req, res) => {
    try {
        const { id } = req.params; // ID del pedido

        // Verificar si el pedido pertenece al usuario autenticado
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este pedido' });
        }

        // Eliminar el pedido
        await order.deleteOne();

        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message });
    }
};
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getUserOrders,

    editUserOrder,
    deleteUserOrder,
     
};
