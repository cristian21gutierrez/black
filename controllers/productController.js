const Product = require('../models/Product');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

// Modificar un producto
const updateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(`ID recibido para actualización: ${id}`);

        // Eliminar caracteres no deseados del ID 
        id = id.replace(/:/g, '');
        console.log(`ID limpiado para actualización: ${id}`);

        // Verificar si el ID es válido
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            console.log(`ID inválido detectado: ${id}`);
            return res.status(400).json({ message: 'ID inválido' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};



// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
    try {
        const { categoria } = req.params;
        const products = await Product.find({ categoria });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos por categoría' });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory, 
};
