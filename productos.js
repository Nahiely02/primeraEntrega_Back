const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PRODUCTS_FILE = './data/productos.json';

function readProducts() {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE));
}

function saveProducts(products) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    const products = readProducts();
    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
});

module.exports = router;
