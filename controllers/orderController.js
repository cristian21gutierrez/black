const Order = require('../models/Order');
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; 
        
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

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

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params; 

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

const getUserOrders = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido.' });
        }

        const orders = await Order.find({ userId }).populate('productId');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este usuario.' });
        }

        res.json(orders);
    } catch (error) {
        console.error('Error al buscar los pedidos del usuario:', error);
        res.status(500).json({ message: 'Error al buscar los pedidos del usuario', error: error.message });
    }
};


const editUserOrder = async (req, res) => {
    try {
        const { id } = req.params; 
        const { quantity, status } = req.body; 

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar este pedido' });
        }

        if (quantity) order.quantity = quantity;
        if (status) order.status = status; 
        await order.save();

        res.json({ message: 'Pedido actualizado', order });
    } catch (error) {
        console.error('Error al editar el pedido:', error);
        res.status(500).json({ message: 'Error al editar el pedido', error: error.message });
    }
};

const deleteUserOrder = async (req, res) => {
    try {
        const { id } = req.params; 

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este pedido' });
        }

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
