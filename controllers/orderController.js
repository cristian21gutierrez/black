const Order = require('../models/Order');

// Crear un nuevo pedido
const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; // Obtener el ID del usuario autenticado

        // Validar campos requeridos
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear nuevo pedido con el estado inicial correcto
        const newOrder = new Order({
            userId,
            productId,
            quantity,
            status: 'pendiente', // Usar el valor en español definido en el enum
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
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

// Obtener un pedido por ID (admin o el mismo usuario)
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Verificar que el usuario es el dueño del pedido o es un admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== order.userId.toString()) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el pedido', error });
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

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
};
