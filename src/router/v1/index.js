const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth-controller');

router.post('/singup', AuthController.signup);
router.post('/login', AuthController.signin);
router.get('/all', AuthController.getAll);
router.get('/auth/verify', AuthController.validateToken);
router.get('/auth', (req, res) => {
    res.status(200).json({ message: 'auth service' });
})

module.exports = router;