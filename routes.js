const express = require('express');
const router = express.Router();
const pessoasController = require('./src/controllers/pessoasController');
const carrosController = require('./src/controllers/carrosController');
const animaisController = require('./src/controllers/animaisController');

router.use('/pessoas', pessoasController);
router.use('/carros', carrosController);
router.use('/animais', animaisController);


module.exports = router;