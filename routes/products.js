const express = require('express');
const router = express.Router();
const fs = require('fs');

const productosFilePath = './data/productos.json';

// Middleware para cargar los productos desde el archivo JSON
function loadProductos() {
  const data = fs.readFileSync(productosFilePath, 'utf8');
  return JSON.parse(data);
}

// Ruta: GET /api/products
router.get('/', (req, res) => {
  try {
    const productos = loadProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta: GET /api/products/:pid
router.get('/:pid', (req, res) => {
  try {
    const productos = loadProductos();
    const producto = productos.find(p => p.id === parseInt(req.params.pid));
    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(producto);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Ruta: POST /api/products
router.post('/', (req, res) => {
  try {
    const productos = loadProductos();
    const newProduct = {
      id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status !== undefined ? req.body.status : true,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails || []
    };

    productos.push(newProduct);
    fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Ruta: PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  try {
    const productos = loadProductos();
    const index = productos.findIndex(p => p.id === parseInt(req.params.pid));

    if (index === -1) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      // Actualizar producto
      productos[index] = {
        ...productos[index],
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status !== undefined ? req.body.status : true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || productos[index].thumbnails // Mantener las existentes si no se envían nuevas
      };

      fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
      res.json(productos[index]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Ruta: DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  try {
    let productos = loadProductos();
    const index = productos.findIndex(p => p.id === parseInt(req.params.pid));

    if (index === -1) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      productos = productos.filter(p => p.id !== parseInt(req.params.pid));
      fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
