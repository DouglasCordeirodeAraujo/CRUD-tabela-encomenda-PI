const express = require('express');
const router = express.Router();
const encomendasController = require('../controllers/encomendasController');
const auth = require('../middlewares/auth');

router.get('/listarencomenda', auth, encomendasController.listarEncomenda);
router.get('/listarencomendas', encomendasController.listarEncomendas);
router.post('/criarencomenda', auth, encomendasController.criarEncomenda);
router.put('/:id', auth, encomendasController.atualizarEncomenda);
router.delete('/:id', auth, encomendasController.excluirEncomenda);

module.exports = router;