const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

router.get('/', partidoController.getPartidos);
router.get('/:id', partidoController.getPartidoById);
router.post('/', partidoController.postPartido);
router.put('/:id', partidoController.putPartido);
router.delete('/:id', partidoController.deletePartido);

module.exports = router;
