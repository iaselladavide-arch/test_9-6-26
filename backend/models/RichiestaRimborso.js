const mongoose = require('mongoose');

const richiestaRimborsoSchema = new mongoose.Schema({
  dataInserimento: {
    type: Date,
    default: Date.now
  },
  dataSpesa: {
    type: Date,
    required: true
  },
  categoriaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoriaSpesa',
    required: true
  },
  importo: {
    type: Number,
    required: true,
    min: 0.01
  },
  descrizione: {
    type: String,
    required: true,
    trim: true
  },
  riferimentoGiustificativo: {
    type: String,
    trim: true
  },
  stato: {
    type: String,
    enum: ['In attesa', 'Approvata', 'Rifiutata', 'Liquidata'],
    default: 'In attesa'
  },
  dipendenteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dataValutazione: {
    type: Date
  },
  responsabileValutazioneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  motivazioneRifiuto: {
    type: String,
    trim: true
  },
  dataLiquidazione: {
    type: Date
  }
});

module.exports = mongoose.model('RichiestaRimborso', richiestaRimborsoSchema);
