const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const CART_FILE = './data/carrito.json';

function readCart() {
    return JSON.parse(fs.readFileSync(CART_FILE));
}

function saveCart(cart) {
    fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
}

router.post('/', (req, res) => {
    const newCart = {
        id: uuidv4(),
        products: []
    };

    saveCart(newCart);

    res.status(201).json(newCart);
});

module.exports = router;
