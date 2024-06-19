const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const fs = require('fs');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Rutas para los endpoints de productos y carritos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = process.env.PORT || 3000;

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
