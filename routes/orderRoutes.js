const express = require('express');
const router = express.Router();
const { protegerRuta, verificarAdmin } = require('../middleware/authMiddleware');
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder, getUserOrders,editUserOrder, 
    deleteUserOrder  } = require('../controllers/orderController');



router.put('/:id', protegerRuta, editUserOrder); // Editar un pedido del usuario autenticado
router.delete('/:id', protegerRuta, deleteUserOrder); // Eliminar un pedido del usuario autenticado


// Ruta para obtener los pedidos del usuario autenticado (usuario común)
router.get('/myorders', protegerRuta, getUserOrders);

// Ruta para crear un nuevo pedido (usuarios autenticados)
router.post('/', protegerRuta, createOrder);

// Ruta para obtener todos los pedidos (solo admin)
router.get('/', protegerRuta, verificarAdmin, getAllOrders);

// Ruta para obtener un pedido por ID (admin o el mismo usuario)
router.get('/:id', protegerRuta, getOrderById);

// Ruta para actualizar el estado de un pedido (solo admin)
router.put('/:id', protegerRuta, verificarAdmin, updateOrderStatus);

// Ruta para eliminar un pedido (solo admin)
router.delete('/:id', protegerRuta, verificarAdmin, deleteOrder);

module.exports = router;
