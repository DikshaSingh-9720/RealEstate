const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const { validateLandCreation, validateLandUpdate, validateSearch } = require('../middleware/validation');

// Public routes - Browse and search lands
router.get('/', validateSearch, landController.getAllLands);
router.get('/search', validateSearch, landController.searchLands);
router.get('/featured', landController.getFeaturedLands);
router.get('/nearby', landController.getNearbyLands);
router.get('/statistics', landController.getLandStatistics);
router.get('/:id', landController.getLandById);
router.post('/:id/view', landController.recordView); // Track views

// Filter routes
router.get('/filter/crops', landController.getLandsByCrop);
router.get('/filter/location', landController.getLandsByLocation);
router.get('/filter/price-range', landController.getLandsByPriceRange);
router.get('/filter/size-range', landController.getLandsBySizeRange);

// Protected routes - Require authentication
router.use(auth); // Apply auth middleware to all routes below

// Farmer routes - Manage own lands
router.post('/', upload.array('images', 10), validateLandCreation, landController.createLand);
router.get('/my/listings', landController.getMyLands);
router.put('/my/:id', upload.array('images', 10), validateLandUpdate, landController.updateMyLand);
router.delete('/my/:id', landController.deleteMyLand);
router.patch('/my/:id/status', landController.updateLandStatus);

// Document management
router.post('/:id/documents', upload.array('documents', 5), landController.uploadDocuments);
router.delete('/:id/documents/:documentId', landController.deleteDocument);

// Wishlist/Saved lands management
router.post('/:id/save', landController.saveLand);
router.delete('/:id/save', landController.unsaveLand);
router.get('/saved/my', landController.getMySavedLands);

// Inquiry management
router.post('/:id/inquire', landController.createInquiry);
router.get('/inquiries/sent', landController.getSentInquiries);
router.get('/inquiries/received', landController.getReceivedInquiries);
router.put('/inquiries/:inquiryId', landController.updateInquiry);
router.post('/inquiries/:inquiryId/reply', landController.replyToInquiry);

// Reporting
router.post('/:id/report', landController.reportLand);

// Admin routes - Land approval and management
router.use(admin); // Apply admin middleware to routes below

// Land approval workflow
router.get('/admin/pending', landController.getPendingLands);
router.post('/admin/:id/approve', landController.approveLand);
router.post('/admin/:id/reject', landController.rejectLand);
router.post('/admin/:id/feature', landController.featureLand);
router.delete('/admin/:id/feature', landController.unfeatureLand);

// Admin management
router.get('/admin/all', landController.getAllLandsAdmin);
router.patch('/admin/:id/status', landController.updateLandStatusAdmin);
router.delete('/admin/:id', landController.deleteLandAdmin);

// Analytics and reports
router.get('/admin/analytics', landController.getAnalytics);
router.get('/admin/reports', landController.getReports);

module.exports = router;