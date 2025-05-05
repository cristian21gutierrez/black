const express = require('express');
const router = express.Router();
const { protegerRuta, verificarAdmin } = require('../middleware/authMiddleware');
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder, getUserOrders,editUserOrder, 
    deleteUserOrder  } = require('../controllers/orderController');


router.put('/:id', protegerRuta, editUserOrder); 
router.delete('/:id', protegerRuta, deleteUserOrder); 
router.get('/myorders', protegerRuta, getUserOrders);
router.post('/', protegerRuta, createOrder);
router.get('/', protegerRuta, verificarAdmin, getAllOrders);
router.get('/:id', protegerRuta, getOrderById);
router.put('/admin/:id', protegerRuta, verificarAdmin, updateOrderStatus);
router.delete('/:id', protegerRuta, verificarAdmin, deleteOrder);

module.exports = router;
