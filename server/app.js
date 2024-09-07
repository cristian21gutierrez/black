const express = require('express');
const { connected } = require('../database/connect');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connected();

// Importar y usar las rutas
const userRoutes = require('../routes/userRoutes');
const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');
const authRoutes = require('../routes/authRoutes'); 

// Prefijos para las rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
