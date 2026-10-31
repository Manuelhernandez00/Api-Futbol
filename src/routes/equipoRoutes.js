const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

router.get('/', equipoController.getEquipos);
router.get('/:id', equipoController.getEquipoById);
router.post('/', equipoController.postEquipo);
router.put('/:id', equipoController.putEquipo);
router.delete('/:id', equipoController.deleteEquipo);

module.exports = router;
