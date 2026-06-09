const RichiestaRimborso = require('../models/RichiestaRimborso');
const CategoriaSpesa = require('../models/CategoriaSpesa');
const User = require('../models/User');

exports.createRichiesta = async (req, res) => {
  try {
    const { dataSpesa, categoriaId, importo, descrizione, riferimentoGiustificativo } = req.body;

    if (!dataSpesa || !categoriaId || !importo || !descrizione) {
      return res.status(400).json({ error: 'Campi obbligatori mancanti' });
    }

    if (importo <= 0) {
      return res.status(400).json({ error: 'L\'importo deve essere maggiore di zero' });
    }

    if (descrizione.trim().length === 0) {
      return res.status(400).json({ error: 'La descrizione non può essere vuota' });
    }

    if (riferimentoGiustificativo && riferimentoGiustificativo.trim().length === 0) {
      return res.status(400).json({ error: 'Il riferimento non può contenere solo spazi' });
    }

    const categoria = await CategoriaSpesa.findById(categoriaId);
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria non trovata' });
    }

    const richiesta = new RichiestaRimborso({
      dataSpesa,
      categoriaId,
      importo,
      descrizione: descrizione.trim(),
      riferimentoGiustificativo: riferimentoGiustificativo?.trim() || null,
      dipendenteId: req.userId,
      stato: 'In attesa'
    });

    await richiesta.save();
    await richiesta.populate('categoriaId');

    res.status(201).json({
      message: 'Richiesta creata con successo',
      richiesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella creazione della richiesta' });
  }
};

exports.getRichieste = async (req, res) => {
  try {
    const { stato, categoria, mese, dipendente } = req.query;
    const isAdmin = req.userRole === 'Responsabile amministrativo';

    let filter = {};

    if (!isAdmin) {
      filter.dipendenteId = req.userId;
    }

    if (stato) filter.stato = stato;
    if (categoria) filter.categoriaId = categoria;
    if (dipendente && isAdmin) filter.dipendenteId = dipendente;

    if (mese) {
      const [year, month] = mese.split('-');
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      filter.dataSpesa = { $gte: startDate, $lte: endDate };
    }

    const richieste = await RichiestaRimborso.find(filter)
      .populate('categoriaId')
      .populate('dipendenteId', 'nome cognome email')
      .populate('responsabileValutazioneId', 'nome cognome email')
      .sort({ dataInserimento: -1 });

    res.json(richieste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle richieste' });
  }
};

exports.getRichiestaById = async (req, res) => {
  try {
    const richiesta = await RichiestaRimborso.findById(req.params.id)
      .populate('categoriaId')
      .populate('dipendenteId', 'nome cognome email')
      .populate('responsabileValutazioneId', 'nome cognome email');

    if (!richiesta) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    const isAdmin = req.userRole === 'Responsabile amministrativo';
    if (!isAdmin && richiesta.dipendenteId._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    res.json(richiesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero della richiesta' });
  }
};

exports.updateRichiesta = async (req, res) => {
  try {
    const richiesta = await RichiestaRimborso.findById(req.params.id);

    if (!richiesta) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (richiesta.dipendenteId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    if (richiesta.stato !== 'In attesa') {
      return res.status(400).json({ error: 'Non puoi modificare una richiesta già valutata' });
    }

    const { dataSpesa, categoriaId, importo, descrizione, riferimentoGiustificativo } = req.body;

    if (importo !== undefined && importo <= 0) {
      return res.status(400).json({ error: 'L\'importo deve essere maggiore di zero' });
    }

    if (descrizione !== undefined && descrizione.trim().length === 0) {
      return res.status(400).json({ error: 'La descrizione non può essere vuota' });
    }

    if (categoriaId) {
      const categoria = await CategoriaSpesa.findById(categoriaId);
      if (!categoria) {
        return res.status(400).json({ error: 'Categoria non trovata' });
      }
    }

    if (dataSpesa) richiesta.dataSpesa = dataSpesa;
    if (categoriaId) richiesta.categoriaId = categoriaId;
    if (importo) richiesta.importo = importo;
    if (descrizione) richiesta.descrizione = descrizione.trim();
    if (riferimentoGiustificativo !== undefined) {
      richiesta.riferimentoGiustificativo = riferimentoGiustificativo?.trim() || null;
    }

    await richiesta.save();
    await richiesta.populate('categoriaId');

    res.json({
      message: 'Richiesta aggiornata con successo',
      richiesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento della richiesta' });
  }
};

exports.deleteRichiesta = async (req, res) => {
  try {
    const richiesta = await RichiestaRimborso.findById(req.params.id);

    if (!richiesta) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (richiesta.dipendenteId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Accesso negato' });
    }

    if (richiesta.stato !== 'In attesa') {
      return res.status(400).json({ error: 'Non puoi eliminare una richiesta già valutata' });
    }

    await RichiestaRimborso.findByIdAndDelete(req.params.id);

    res.json({ message: 'Richiesta eliminata con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nell\'eliminazione della richiesta' });
  }
};

exports.approvaRichiesta = async (req, res) => {
  try {
    const richiesta = await RichiestaRimborso.findById(req.params.id);

    if (!richiesta) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (richiesta.stato !== 'In attesa') {
      return res.status(400).json({ error: 'Solo le richieste in attesa possono essere approvate' });
    }

    richiesta.stato = 'Approvata';
    richiesta.dataValutazione = new Date();
    richiesta.responsabileValutazioneId = req.userId;

    await richiesta.save();
    await richiesta.populate('categoriaId');

    res.json({
      message: 'Richiesta approvata',
      richiesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nell\'approvazione della richiesta' });
  }
};

exports.rifiutaRichiesta = async (req, res) => {
  try {
    const { motivazione } = req.body;
    const richiesta = await RichiestaRimborso.findById(req.params.id);

    if (!richiesta) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (richiesta.stato !== 'In attesa') {
      return res.status(400).json({ error: 'Solo le richieste in attesa possono essere rifiutate' });
    }

    richiesta.stato = 'Rifiutata';
    richiesta.dataValutazione = new Date();
    richiesta.responsabileValutazioneId = req.userId;
    richiesta.motivazioneRifiuto = motivazione || null;

    await richiesta.save();
    await richiesta.populate('categoriaId');

    res.json({
      message: 'Richiesta rifiutata',
      richiesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel rifiuto della richiesta' });
  }
};

exports.liquidaRichiesta = async (req, res) => {
  try {
    const richiesta = await RichiestaRimborso.findById(req.params.id);

    if (!richiesta) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    if (richiesta.stato !== 'Approvata') {
      return res.status(400).json({ error: 'Solo le richieste approvate possono essere liquidate' });
    }

    richiesta.stato = 'Liquidata';
    richiesta.dataLiquidazione = new Date();

    await richiesta.save();
    await richiesta.populate('categoriaId');

    res.json({
      message: 'Richiesta liquidata',
      richiesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella liquidazione della richiesta' });
  }
};
