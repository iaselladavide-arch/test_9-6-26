const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const categorieController = require('../controllers/categorieController');

router.use(auth);

router.get('/', categorieController.getCategorie);
router.post('/', requireRole(['Responsabile amministrativo']), categorieController.createCategoria);

module.exports = router;
