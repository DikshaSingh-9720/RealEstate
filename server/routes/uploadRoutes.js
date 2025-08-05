const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

router.post('/image', auth, upload.single('image'), uploadImage);

module.exports = router; 