const express = require('express');
const router = express.Router();
const fs = require('fs');

const carritoFilePath = './data/carrito.json';

// Middleware para cargar el carrito desde el archivo JSON
function loadCarrito() {
  const data = fs.readFileSync(carritoFilePath, 'utf8');
  return JSON.parse(data);
}

// Ruta: POST /api/carts
router.post('/', (req, res) => {
  try {
    const carrito = loadCarrito();
    const newCart = {
      id: carrito.length > 0 ? carrito[carrito.length - 1].id + 1 : 1,
      products: []
    };

    carrito.push(newCart);
    fs.writeFileSync(carritoFilePath, JSON.stringify(carrito, null, 2));

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Ruta: GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  try {
    const carrito = loadCarrito();
    const cart = carrito.find(c => c.id === parseInt(req.params.cid));

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Ruta: POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  try {
    const carrito = loadCarrito();
    const cartIndex = carrito.findIndex(c => c.id === parseInt(req.params.cid));

    if (cartIndex === -1) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      const productId = parseInt(req.params.pid);
      const existingProductIndex = carrito[cartIndex].products.findIndex(p => p.id === productId);

      if (existingProductIndex !== -1) {
        // Si el producto ya existe en el carrito, incrementar la cantidad
        carrito[cartIndex].products[existingProductIndex].quantity++;
      } else {
        // Agregar el producto al carrito
        carrito[cartIndex].products.push({
          id: productId,
          quantity: 1
        });
      }

      fs.writeFileSync(carritoFilePath, JSON.stringify(carrito, null, 2));
      res.status(201).json(carrito[cartIndex]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;
