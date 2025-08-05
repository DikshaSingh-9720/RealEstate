const { body, query, param } = require('express-validator');

// Land creation validation
exports.validateLandCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-,.()]+$/)
    .withMessage('Title contains invalid characters'),

  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('price')
    .isFloat({ min: 1000 })
    .withMessage('Price must be at least ₹1,000')
    .toFloat(),

  body('pricePerAcre')
    .isFloat({ min: 100 })
    .withMessage('Price per acre must be at least ₹100')
    .toFloat(),

  body('landType')
    .isIn(['cropland', 'pasture', 'orchard', 'vineyard', 'dairy-farm', 'poultry-farm', 'mixed-farming', 'organic-certified', 'greenhouse'])
    .withMessage('Invalid land type'),

  body('totalArea')
    .isFloat({ min: 0.1, max: 10000 })
    .withMessage('Total area must be between 0.1 and 10,000 acres')
    .toFloat(),

  body('cultivableArea')
    .isFloat({ min: 0 })
    .withMessage('Cultivable area must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.totalArea) {
        throw new Error('Cultivable area cannot exceed total area');
      }
      return true;
    }),

  body('irrigatedArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Irrigated area must be a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.cultivableArea) {
        throw new Error('Irrigated area cannot exceed cultivable area');
      }
      return true;
    }),

  body('status')
    .isIn(['sale', 'lease', 'rent'])
    .withMessage('Status must be sale, lease, or rent'),

  body('leaseType')
    .optional()
    .isIn(['short-term', 'long-term', 'seasonal'])
    .withMessage('Invalid lease type')
    .custom((value, { req }) => {
      if ((req.body.status === 'lease' || req.body.status === 'rent') && !value) {
        throw new Error('Lease type is required for lease/rent listings');
      }
      return true;
    }),

  // Location validation
  body('location.address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),

  body('location.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('City contains invalid characters'),

  body('location.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('State contains invalid characters'),

  body('location.zipCode')
    .matches(/^\d{6}$/)
    .withMessage('Zip code must be a 6-digit number'),

  body('location.coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),

  body('location.coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),

  // Agricultural specifications
  body('soilType')
    .isIn(['alluvial', 'black-cotton', 'red-laterite', 'sandy', 'clay', 'loamy', 'saline', 'alkaline'])
    .withMessage('Invalid soil type'),

  body('soilQuality')
    .isIn(['excellent', 'good', 'average', 'poor'])
    .withMessage('Invalid soil quality'),

  body('suitableCrops')
    .isArray({ min: 1 })
    .withMessage('At least one suitable crop must be specified'),

  body('suitableCrops.*')
    .isIn(['wheat', 'rice', 'corn', 'soybeans', 'cotton', 'sugarcane', 'vegetables', 'fruits', 'pulses', 'spices', 'flowers', 'fodder', 'medicinal-plants', 'organic-farming'])
    .withMessage('Invalid crop type'),

  body('waterSources')
    .optional()
    .isArray()
    .withMessage('Water sources must be an array'),

  body('waterSources.*')
    .optional()
    .isIn(['borewell', 'tube-well', 'canal', 'river', 'pond', 'rainwater-harvesting', 'drip-irrigation', 'sprinkler'])
    .withMessage('Invalid water source'),

  body('waterAvailability')
    .isIn(['year-round', 'seasonal', 'monsoon-dependent', 'limited'])
    .withMessage('Invalid water availability'),

  // Infrastructure validation
  body('infrastructure.electricity')
    .optional()
    .isBoolean()
    .withMessage('Electricity must be boolean')
    .toBoolean(),

  body('infrastructure.roadAccess')
    .optional()
    .isIn(['paved', 'unpaved', 'seasonal', 'no-access'])
    .withMessage('Invalid road access type'),

  body('infrastructure.storage')
    .optional()
    .isBoolean()
    .withMessage('Storage must be boolean')
    .toBoolean(),

  body('infrastructure.farmHouse')
    .optional()
    .isBoolean()
    .withMessage('Farm house must be boolean')
    .toBoolean(),

  body('infrastructure.boundary')
    .optional()
    .isIn(['fenced', 'walled', 'marked', 'none'])
    .withMessage('Invalid boundary type'),

  // Environmental factors
  body('climate')
    .isIn(['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'])
    .withMessage('Invalid climate type'),

  body('rainfall')
    .isIn(['heavy', 'moderate', 'low', 'very-low'])
    .withMessage('Invalid rainfall level'),

  // Legal documentation
  body('landDocuments.hasTitle')
    .optional()
    .isBoolean()
    .withMessage('Has title must be boolean')
    .toBoolean(),

  body('landDocuments.surveyNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Survey number must be less than 50 characters'),

  body('landDocuments.khataNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Khata number must be less than 50 characters'),

  body('landDocuments.clearTitle')
    .optional()
    .isBoolean()
    .withMessage('Clear title must be boolean')
    .toBoolean(),
];

// Land update validation (similar to creation but with optional fields)
exports.validateLandUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 1000 })
    .withMessage('Price must be at least ₹1,000')
    .toFloat(),

  body('pricePerAcre')
    .optional()
    .isFloat({ min: 100 })
    .withMessage('Price per acre must be at least ₹100')
    .toFloat(),

  body('landType')
    .optional()
    .isIn(['cropland', 'pasture', 'orchard', 'vineyard', 'dairy-farm', 'poultry-farm', 'mixed-farming', 'organic-certified', 'greenhouse'])
    .withMessage('Invalid land type'),

  body('totalArea')
    .optional()
    .isFloat({ min: 0.1, max: 10000 })
    .withMessage('Total area must be between 0.1 and 10,000 acres')
    .toFloat(),

  body('status')
    .optional()
    .isIn(['sale', 'lease', 'rent'])
    .withMessage('Status must be sale, lease, or rent'),

  // Add other update validations as needed...
];

// Search validation
exports.validateSearch = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be between 1 and 1000')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('sort')
    .optional()
    .isIn(['price', '-price', 'pricePerAcre', '-pricePerAcre', 'totalArea', '-totalArea', 'createdAt', '-createdAt', 'views', '-views'])
    .withMessage('Invalid sort parameter'),

  query('landType')
    .optional()
    .isIn(['cropland', 'pasture', 'orchard', 'vineyard', 'dairy-farm', 'poultry-farm', 'mixed-farming', 'organic-certified', 'greenhouse'])
    .withMessage('Invalid land type'),

  query('status')
    .optional()
    .isIn(['sale', 'lease', 'rent'])
    .withMessage('Invalid status'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be positive')
    .toFloat(),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be positive')
    .toFloat()
    .custom((value, { req }) => {
      if (req.query.minPrice && value < parseFloat(req.query.minPrice)) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),

  query('minPricePerAcre')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price per acre must be positive')
    .toFloat(),

  query('maxPricePerAcre')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price per acre must be positive')
    .toFloat(),

  query('minArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum area must be positive')
    .toFloat(),

  query('maxArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum area must be positive')
    .toFloat()
    .custom((value, { req }) => {
      if (req.query.minArea && value < parseFloat(req.query.minArea)) {
        throw new Error('Maximum area must be greater than minimum area');
      }
      return true;
    }),

  query('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('City contains invalid characters'),

  query('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('State contains invalid characters'),

  query('soilType')
    .optional()
    .isIn(['alluvial', 'black-cotton', 'red-laterite', 'sandy', 'clay', 'loamy', 'saline', 'alkaline'])
    .withMessage('Invalid soil type'),

  query('soilQuality')
    .optional()
    .isIn(['excellent', 'good', 'average', 'poor'])
    .withMessage('Invalid soil quality'),

  query('suitableCrops')
    .optional()
    .custom((value) => {
      // Handle both single value and array
      const crops = Array.isArray(value) ? value : [value];
      const validCrops = ['wheat', 'rice', 'corn', 'soybeans', 'cotton', 'sugarcane', 'vegetables', 'fruits', 'pulses', 'spices', 'flowers', 'fodder', 'medicinal-plants', 'organic-farming'];
      
      for (const crop of crops) {
        if (!validCrops.includes(crop)) {
          throw new Error(`Invalid crop: ${crop}`);
        }
      }
      return true;
    }),

  query('waterSources')
    .optional()
    .custom((value) => {
      const sources = Array.isArray(value) ? value : [value];
      const validSources = ['borewell', 'tube-well', 'canal', 'river', 'pond', 'rainwater-harvesting', 'drip-irrigation', 'sprinkler'];
      
      for (const source of sources) {
        if (!validSources.includes(source)) {
          throw new Error(`Invalid water source: ${source}`);
        }
      }
      return true;
    }),

  query('waterAvailability')
    .optional()
    .isIn(['year-round', 'seasonal', 'monsoon-dependent', 'limited'])
    .withMessage('Invalid water availability'),

  query('climate')
    .optional()
    .isIn(['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'])
    .withMessage('Invalid climate'),

  query('electricity')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Electricity must be true or false'),

  query('roadAccess')
    .optional()
    .isIn(['paved', 'unpaved', 'seasonal', 'no-access'])
    .withMessage('Invalid road access type'),

  // Geospatial search validation
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),

  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),

  query('radius')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Radius must be between 1 and 500 km')
    .toInt(),

  // Custom validation for geospatial search
  query('latitude').custom((value, { req }) => {
    if ((value && !req.query.longitude) || (!value && req.query.longitude)) {
      throw new Error('Both latitude and longitude are required for location-based search');
    }
    return true;
  }),
];

// User registration validation
exports.validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/)
    .withMessage('Name contains invalid characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters'),

  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),

  body('userType')
    .optional()
    .isIn(['farmer', 'buyer', 'agent'])
    .withMessage('Invalid user type'),

  // Farmer profile validation
  body('farmerProfile.farmingExperience')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Farming experience must be between 0 and 100 years')
    .toInt(),

  body('farmerProfile.cropsGrown')
    .optional()
    .isArray()
    .withMessage('Crops grown must be an array'),

  body('farmerProfile.farmSize')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Farm size must be between 0 and 10,000 acres')
    .toFloat(),

  body('farmerProfile.location.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('farmerProfile.location.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('farmerProfile.organicCertified')
    .optional()
    .isBoolean()
    .withMessage('Organic certified must be boolean')
    .toBoolean(),

  body('farmerProfile.cooperativeMember')
    .optional()
    .isBoolean()
    .withMessage('Cooperative member must be boolean')
    .toBoolean(),

  body('farmerProfile.preferredContactMethod')
    .optional()
    .isIn(['phone', 'email', 'whatsapp'])
    .withMessage('Invalid contact method'),
];

// User login validation
exports.validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Inquiry creation validation
exports.validateInquiryCreation = [
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),

  body('inquiryType')
    .optional()
    .isIn(['general', 'pricing', 'visit-request', 'document-request', 'negotiation'])
    .withMessage('Invalid inquiry type'),

  body('preferredContactMethod')
    .optional()
    .isIn(['phone', 'email', 'whatsapp', 'in-person'])
    .withMessage('Invalid contact method'),

  body('contactNumber')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),

  // Visit details validation (if inquiry type is visit-request)
  body('visitDetails.preferredDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        throw new Error('Visit date must be in the future');
      }
      return true;
    }),

  body('visitDetails.numberOfVisitors')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of visitors must be between 1 and 20')
    .toInt(),
];

// Parameter validation for IDs
exports.validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

exports.validateInquiryId = [
  param('inquiryId')
    .isMongoId()
    .withMessage('Invalid inquiry ID format'),
];

// Admin validation
exports.validateAdminAction = [
  body('adminComments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin comments must be less than 500 characters'),
];