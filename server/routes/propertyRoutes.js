const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { saveToWishlist, removeFromWishlist, getWishlist } = require('../controllers/propertyController');

// Public
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Admin (protected)
router.post('/', auth, admin, propertyController.createProperty);
router.put('/:id', auth, admin, propertyController.updateProperty);
router.delete('/:id', auth, admin, propertyController.deleteProperty);
router.post('/:id/wishlist', auth, saveToWishlist);
router.delete('/:id/wishlist', auth, removeFromWishlist);
router.get('/wishlist/me', auth, getWishlist);

module.exports = router; 