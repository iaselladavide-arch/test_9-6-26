const RichiestaRimborso = require('../models/RichiestaRimborso');

exports.getStatistiche = async (req, res) => {
  try {
    const { mese, categoriaId, dipendenteId } = req.query;

    let match = {};

    if (mese) {
      const [year, month] = mese.split('-');
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      match.dataSpesa = { $gte: startDate, $lte: endDate };
    }

    if (categoriaId) match.categoriaId = mongoose.Types.ObjectId(categoriaId);
    if (dipendenteId) match.dipendenteId = mongoose.Types.ObjectId(dipendenteId);

    const statistiche = await RichiestaRimborso.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            mese: {
              $dateToString: { format: '%Y-%m', date: '$dataSpesa' }
            },
            categoria: '$categoriaId'
          },
          numeroRichieste: { $sum: 1 },
          totaleRichiesto: {
            $sum: { $cond: [true, '$importo', 0] }
          },
          totaleApprovato: {
            $sum: {
              $cond: [
                { $eq: ['$stato', 'Approvata'] },
                '$importo',
                0
              ]
            }
          },
          totaleLiquidato: {
            $sum: {
              $cond: [
                { $eq: ['$stato', 'Liquidata'] },
                '$importo',
                0
              ]
            }
          }
        }
      },
      { $sort: { '_id.mese': -1 } }
    ]);

    const mongoose = require('mongoose');
    const CategoriaSpesa = require('../models/CategoriaSpesa');

    const result = await Promise.all(
      statistiche.map(async (stat) => {
        const categoria = await CategoriaSpesa.findById(stat._id.categoria);
        return {
          mese: stat._id.mese,
          categoria: categoria?.descrizione || 'Sconosciuta',
          numeroRichieste: stat.numeroRichieste,
          totaleRichiesto: Math.round(stat.totaleRichiesto * 100) / 100,
          totaleApprovato: Math.round(stat.totaleApprovato * 100) / 100,
          totaleLiquidato: Math.round(stat.totaleLiquidato * 100) / 100
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
};
