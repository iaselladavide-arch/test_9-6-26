const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const rimborsiController = require('../controllers/rimborsiController');

router.use(auth);

router.get('/', rimborsiController.getRichieste);
router.get('/:id', rimborsiController.getRichiestaById);
router.post('/', rimborsiController.createRichiesta);
router.put('/:id', rimborsiController.updateRichiesta);
router.delete('/:id', rimborsiController.deleteRichiesta);

router.put('/:id/approva', requireRole(['Responsabile amministrativo']), rimborsiController.approvaRichiesta);
router.put('/:id/rifiuta', requireRole(['Responsabile amministrativo']), rimborsiController.rifiutaRichiesta);
router.put('/:id/liquida', requireRole(['Responsabile amministrativo']), rimborsiController.liquidaRichiesta);

module.exports = router;
