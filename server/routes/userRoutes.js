const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateAvatar } = require('../controllers/userController');
const auth = require('../middleware/auth');

const upload = require("../middleware/upload");

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.patch("/avatar", auth, upload.single("avatar"), updateAvatar);

module.exports = router; 