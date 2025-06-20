const express = require('express');
const router = express.Router();

const validateRegister = require('../middlewares/validateRegister');
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/userController');

router.post('/register', validateRegister, userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);

router.get('/me', auth, userCtrl.getProfile);
router.put('/me', auth, userCtrl.updateProfile);
router.post('/alterar-senha-logado', auth, userCtrl.alterarSenhaLogado);
router.delete('/me', auth, userCtrl.deleteUser);

router.get('/verify-token', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;