const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const productRouter = require('./product');
const cartRouter = require('./cart');

app.use(bodyParser.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
