const express = require('express');
const router = express.Router();
const paisController = require('../controllers/paisController');

router.get('/', paisController.getPaises);
router.get('/:id', paisController.getPaisById);
router.post('/', paisController.postPais);
router.put('/:id', paisController.putPais);
router.delete('/:id', paisController.deletePais);

module.exports = router;
