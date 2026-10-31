const express = require('express');
const router = express.Router();
const estadioController = require('../controllers/estadioController');

router.get('/', estadioController.getEstadios);
router.get('/:id', estadioController.getEstadioById);
router.post('/', estadioController.postEstadio);
router.put('/:id', estadioController.putEstadio);
router.delete('/:id', estadioController.deleteEstadio);

module.exports = router;
