const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

router.get('/', jugadorController.getJugadores);
router.get('/:id', jugadorController.getJugadorById);
router.post('/', jugadorController.postJugador);
router.put('/:id', jugadorController.putJugador);
router.delete('/:id', jugadorController.deleteJugador);

module.exports = router;
