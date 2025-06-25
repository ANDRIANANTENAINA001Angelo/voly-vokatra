const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', authMiddleware, authCtrl.logout);
router.get('/me', authMiddleware, authCtrl.me);
router.patch('/profile', authMiddleware, authCtrl.updateProfile);
router.get('/all-users', authCtrl.getAllUsers);

module.exports = router;


