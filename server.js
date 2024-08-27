const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB Atlas
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Definición del modelo de producto
const productSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

// Ruta para buscar producto por código
app.get('/api/products/:code', async (req, res) => {
  try {
    const product = await Product.findOne({ code: req.params.code });
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
