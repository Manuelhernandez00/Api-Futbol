const express = require('express');
const router = express.Router();
const golController = require('../controllers/golController');

router.get('/', golController.getGoles);
router.get('/:id', golController.getGolById);
router.post('/', golController.postGol);
router.put('/:id', golController.putGol);
router.delete('/:id', golController.deleteGol);

module.exports = router;
