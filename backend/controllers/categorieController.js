const CategoriaSpesa = require('../models/CategoriaSpesa');

exports.getCategorie = async (req, res) => {
  try {
    const categorie = await CategoriaSpesa.find().sort({ descrizione: 1 });
    res.json(categorie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle categorie' });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { descrizione } = req.body;

    if (!descrizione || descrizione.trim().length === 0) {
      return res.status(400).json({ error: 'La descrizione è obbligatoria' });
    }

    const categoria = new CategoriaSpesa({
      descrizione: descrizione.trim()
    });

    await categoria.save();

    res.status(201).json({
      message: 'Categoria creata con successo',
      categoria
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella creazione della categoria' });
  }
};
