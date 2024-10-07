const express = require('express');
const router = express.Router();
const { protegerRuta, verificarAdmin } = require('../middleware/authMiddleware'); 
const { getAllUsers, createUser, updateUser, deleteUser, getUserByUsername } = require('../controllers/userController');

router.get('/', protegerRuta, verificarAdmin, getAllUsers);
router.post('/', createUser);
router.put('/:id', protegerRuta, verificarAdmin, updateUser);
router.delete('/:id', protegerRuta, verificarAdmin, deleteUser);
router.get('/username/:username', protegerRuta, getUserByUsername);

module.exports = router;

