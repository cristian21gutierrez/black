const express = require('express');
const router = express.Router();
const { protegerRuta, verificarAdmin } = require('../middleware/authMiddleware');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductsByCategory } = require('../controllers/productController');

// Rutas públicas
router.get('/', getAllProducts);
router.get('/category/:categoria', getProductsByCategory);

// Rutas protegidas
router.use(protegerRuta); 
router.post('/', verificarAdmin, createProduct);
router.put('/:id', verificarAdmin, updateProduct);
router.delete('/:id', verificarAdmin, deleteProduct);

module.exports = router;
