const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const statisticheController = require('../controllers/statisticheController');

router.use(auth);
router.use(requireRole(['Responsabile amministrativo']));

router.get('/rimborsi', statisticheController.getStatistiche);

module.exports = router;
