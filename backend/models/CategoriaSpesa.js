const mongoose = require('mongoose');

const categoriaSpesaSchema = new mongoose.Schema({
  descrizione: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CategoriaSpesa', categoriaSpesaSchema);
