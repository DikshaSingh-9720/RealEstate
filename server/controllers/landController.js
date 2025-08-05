const AgriculturalLand = require('../models/Property'); // Will be renamed in model
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const { validationResult } = require('express-validator');

// Helper function to build search filters
const buildSearchFilter = (query) => {
  const {
    landType,
    status,
    minPrice,
    maxPrice,
    minPricePerAcre,
    maxPricePerAcre,
    minArea,
    maxArea,
    city,
    state,
    soilType,
    soilQuality,
    suitableCrops,
    waterSources,
    waterAvailability,
    climate,
    electricity,
    roadAccess,
    organicCertified,
    approvalStatus,
    latitude,
    longitude,
    radius
  } = query;

  let filter = {};

  // Basic filters
  if (landType) filter.landType = landType;
  if (status) filter.status = status;
  if (soilType) filter.soilType = soilType;
  if (soilQuality) filter.soilQuality = soilQuality;
  if (waterAvailability) filter.waterAvailability = waterAvailability;
  if (climate) filter.climate = climate;

  // Price filters
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (minPricePerAcre || maxPricePerAcre) {
    filter.pricePerAcre = {};
    if (minPricePerAcre) filter.pricePerAcre.$gte = Number(minPricePerAcre);
    if (maxPricePerAcre) filter.pricePerAcre.$lte = Number(maxPricePerAcre);
  }

  // Area filters
  if (minArea || maxArea) {
    filter.totalArea = {};
    if (minArea) filter.totalArea.$gte = Number(minArea);
    if (maxArea) filter.totalArea.$lte = Number(maxArea);
  }

  // Location filters
  if (city) filter['location.city'] = { $regex: city, $options: 'i' };
  if (state) filter['location.state'] = { $regex: state, $options: 'i' };

  // Array filters
  if (suitableCrops) {
    const crops = Array.isArray(suitableCrops) ? suitableCrops : [suitableCrops];
    filter.suitableCrops = { $in: crops };
  }

  if (waterSources) {
    const sources = Array.isArray(waterSources) ? waterSources : [waterSources];
    filter.waterSources = { $in: sources };
  }

  // Infrastructure filters
  if (electricity !== undefined) filter['infrastructure.electricity'] = electricity === 'true';
  if (roadAccess) filter['infrastructure.roadAccess'] = roadAccess;

  // Approval status (default to approved for public searches)
  filter.approvalStatus = approvalStatus || 'approved';

  return filter;
};

// Public Routes

// Get all lands with pagination and basic filtering
exports.getAllLands = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;

    const filter = buildSearchFilter(req.query);
    
    const lands = await AgriculturalLand.find(filter)
      .populate('listedBy', 'name email phone farmerProfile.isVerified farmerProfile.rating')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AgriculturalLand.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        lands,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching lands', 
      error: error.message 
    });
  }
};

// Advanced search with complex filters
exports.searchLands = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let pipeline = [];
    const filter = buildSearchFilter(req.query);

    // Add geospatial search if coordinates provided
    if (req.query.latitude && req.query.longitude) {
      const radius = parseInt(req.query.radius) || 10; // default 10km
      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
          },
          distanceField: 'distance',
          maxDistance: radius * 1000, // convert to meters
          spherical: true
        }
      });
    }

    // Add match stage
    pipeline.push({ $match: filter });

    // Add lookup for user details
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'listedBy',
        foreignField: '_id',
        as: 'farmer',
        pipeline: [{
          $project: {
            name: 1,
            email: 1,
            phone: 1,
            'farmerProfile.isVerified': 1,
            'farmerProfile.rating': 1,
            'farmerProfile.location': 1
          }
        }]
      }
    });

    // Add sort
    if (!req.query.latitude) {
      const sortOrder = req.query.sort || '-createdAt';
      const sortObj = {};
      if (sortOrder.startsWith('-')) {
        sortObj[sortOrder.substring(1)] = -1;
      } else {
        sortObj[sortOrder] = 1;
      }
      pipeline.push({ $sort: sortObj });
    }

    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const lands = await AgriculturalLand.aggregate(pipeline);
    
    // Get total count for pagination
    const totalPipeline = pipeline.slice(0, -2); // Remove skip and limit
    totalPipeline.push({ $count: "total" });
    const totalResult = await AgriculturalLand.aggregate(totalPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        lands,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error searching lands', 
      error: error.message 
    });
  }
};

// Get featured lands
exports.getFeaturedLands = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const lands = await AgriculturalLand.find({
      isFeatured: true,
      approvalStatus: 'approved'
    })
    .populate('listedBy', 'name farmerProfile.isVerified farmerProfile.rating')
    .sort('-createdAt')
    .limit(limit)
    .lean();

    res.json({
      success: true,
      data: lands
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching featured lands', 
      error: error.message 
    });
  }
};

// Get nearby lands based on coordinates
exports.getNearbyLands = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lands = await AgriculturalLand.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: 'distance',
          maxDistance: radius * 1000, // convert km to meters
          spherical: true,
          query: { approvalStatus: 'approved' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'listedBy',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: lands
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching nearby lands', 
      error: error.message 
    });
  }
};

// Get land statistics
exports.getLandStatistics = async (req, res) => {
  try {
    const stats = await AgriculturalLand.aggregate([
      { $match: { approvalStatus: 'approved' } },
      {
        $group: {
          _id: null,
          totalLands: { $sum: 1 },
          totalArea: { $sum: '$totalArea' },
          avgPrice: { $avg: '$price' },
          avgPricePerAcre: { $avg: '$pricePerAcre' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const landTypeStats = await AgriculturalLand.aggregate([
      { $match: { approvalStatus: 'approved' } },
      {
        $group: {
          _id: '$landType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const locationStats = await AgriculturalLand.aggregate([
      { $match: { approvalStatus: 'approved' } },
      {
        $group: {
          _id: { state: '$location.state', city: '$location.city' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        landTypes: landTypeStats,
        topLocations: locationStats
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
};

// Get land by ID with view tracking
exports.getLandById = async (req, res) => {
  try {
    const land = await AgriculturalLand.findById(req.params.id)
      .populate('listedBy', 'name email phone avatar farmerProfile')
      .lean();

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Only show approved lands to public (unless owner or admin)
    if (land.approvalStatus !== 'approved' && 
        (!req.user || (req.user.id !== land.listedBy._id.toString() && !req.user.isAdmin))) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    res.json({
      success: true,
      data: land
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching land', 
      error: error.message 
    });
  }
};

// Record land view (for analytics)
exports.recordView = async (req, res) => {
  try {
    await AgriculturalLand.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }
    );

    res.json({
      success: true,
      message: 'View recorded'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error recording view', 
      error: error.message 
    });
  }
};

// Filter routes
exports.getLandsByCrop = async (req, res) => {
  try {
    const { crop, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const lands = await AgriculturalLand.find({
      suitableCrops: crop,
      approvalStatus: 'approved'
    })
    .populate('listedBy', 'name farmerProfile.isVerified')
    .skip(skip)
    .limit(parseInt(limit))
    .sort('-createdAt');

    const total = await AgriculturalLand.countDocuments({
      suitableCrops: crop,
      approvalStatus: 'approved'
    });

    res.json({
      success: true,
      data: {
        lands,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching lands by crop', 
      error: error.message 
    });
  }
};

// Additional filter methods would be similar...
exports.getLandsByLocation = async (req, res) => {
  // Similar implementation for location filtering
};

exports.getLandsByPriceRange = async (req, res) => {
  // Similar implementation for price range filtering
};

exports.getLandsBySizeRange = async (req, res) => {
  // Similar implementation for size range filtering
};

// Protected Routes (require authentication)

// Create new land listing
exports.createLand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract image URLs from uploaded files
    const images = req.files ? req.files.map(file => file.path) : [];

    const landData = {
      ...req.body,
      images,
      listedBy: req.user.id,
      approvalStatus: 'pending' // All new listings need approval
    };

    const land = new AgriculturalLand(landData);
    await land.save();

    // Populate the farmer details
    await land.populate('listedBy', 'name email farmerProfile');

    res.status(201).json({
      success: true,
      message: 'Land listing created successfully and submitted for approval',
      data: land
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating land listing', 
      error: error.message 
    });
  }
};

// Get user's own lands
exports.getMyLands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const lands = await AgriculturalLand.find({ listedBy: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AgriculturalLand.countDocuments({ listedBy: req.user.id });

    res.json({
      success: true,
      data: {
        lands,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching your lands', 
      error: error.message 
    });
  }
};

// Update user's own land
exports.updateMyLand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const land = await AgriculturalLand.findOne({
      _id: req.params.id,
      listedBy: req.user.id
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found or you do not have permission to edit it'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      req.body.images = [...(req.body.existingImages || []), ...newImages];
    }

    // Reset approval status if significant changes are made
    const significantFields = ['price', 'totalArea', 'location', 'landType'];
    const hasSignificantChanges = significantFields.some(field => 
      req.body[field] && req.body[field] !== land[field]
    );

    if (hasSignificantChanges) {
      req.body.approvalStatus = 'pending';
    }

    const updatedLand = await AgriculturalLand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('listedBy', 'name email farmerProfile');

    res.json({
      success: true,
      message: hasSignificantChanges ? 
        'Land updated and submitted for re-approval' : 
        'Land updated successfully',
      data: updatedLand
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating land', 
      error: error.message 
    });
  }
};

// Delete user's own land
exports.deleteMyLand = async (req, res) => {
  try {
    const land = await AgriculturalLand.findOneAndDelete({
      _id: req.params.id,
      listedBy: req.user.id
    });

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found or you do not have permission to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Land listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting land', 
      error: error.message 
    });
  }
};

// Update land status (for farmer's own land)
exports.updateLandStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['sale', 'lease', 'rent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const land = await AgriculturalLand.findOneAndUpdate(
      { _id: req.params.id, listedBy: req.user.id },
      { status },
      { new: true }
    );

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    res.json({
      success: true,
      message: 'Land status updated successfully',
      data: land
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating land status', 
      error: error.message 
    });
  }
};

// Save/Unsave land to wishlist
exports.saveLand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const landId = req.params.id;

    if (user.savedLands.includes(landId)) {
      return res.status(400).json({
        success: false,
        message: 'Land already saved'
      });
    }

    user.savedLands.push(landId);
    await user.save();

    res.json({
      success: true,
      message: 'Land saved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error saving land', 
      error: error.message 
    });
  }
};

exports.unsaveLand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const landId = req.params.id;

    user.savedLands = user.savedLands.filter(id => id.toString() !== landId);
    await user.save();

    res.json({
      success: true,
      message: 'Land removed from saved list'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error removing saved land', 
      error: error.message 
    });
  }
};

exports.getMySavedLands = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedLands',
        populate: {
          path: 'listedBy',
          select: 'name farmerProfile.isVerified farmerProfile.rating'
        }
      });

    res.json({
      success: true,
      data: user.savedLands
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching saved lands', 
      error: error.message 
    });
  }
};

// Inquiry management
exports.createInquiry = async (req, res) => {
  try {
    const land = await AgriculturalLand.findById(req.params.id);
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // Prevent farmers from inquiring about their own land
    if (land.listedBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot inquire about your own land'
      });
    }

    const inquiry = new Inquiry({
      land: req.params.id,
      inquirer: req.user.id,
      landOwner: land.listedBy,
      ...req.body
    });

    await inquiry.save();
    
    // Increment inquiry count for the land
    await AgriculturalLand.findByIdAndUpdate(req.params.id, {
      $inc: { inquiries: 1 }
    });

    await inquiry.populate([
      { path: 'land', select: 'title price location' },
      { path: 'inquirer', select: 'name email phone' },
      { path: 'landOwner', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating inquiry', 
      error: error.message 
    });
  }
};

// Continue with more methods...
// (The file is getting quite long, so I'll continue with the remaining methods in the next part)

// Admin Routes

// Get pending lands for approval
exports.getPendingLands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const lands = await AgriculturalLand.find({ approvalStatus: 'pending' })
      .populate('listedBy', 'name email phone farmerProfile')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await AgriculturalLand.countDocuments({ approvalStatus: 'pending' });

    res.json({
      success: true,
      data: {
        lands,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pending lands', 
      error: error.message 
    });
  }
};

// Approve land
exports.approveLand = async (req, res) => {
  try {
    const { adminComments } = req.body;

    const land = await AgriculturalLand.findByIdAndUpdate(
      req.params.id,
      { 
        approvalStatus: 'approved',
        adminComments: adminComments || ''
      },
      { new: true }
    ).populate('listedBy', 'name email');

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // TODO: Send approval notification to farmer

    res.json({
      success: true,
      message: 'Land approved successfully',
      data: land
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error approving land', 
      error: error.message 
    });
  }
};

// Reject land
exports.rejectLand = async (req, res) => {
  try {
    const { adminComments } = req.body;

    if (!adminComments) {
      return res.status(400).json({
        success: false,
        message: 'Admin comments are required for rejection'
      });
    }

    const land = await AgriculturalLand.findByIdAndUpdate(
      req.params.id,
      { 
        approvalStatus: 'rejected',
        adminComments
      },
      { new: true }
    ).populate('listedBy', 'name email');

    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    // TODO: Send rejection notification to farmer

    res.json({
      success: true,
      message: 'Land rejected successfully',
      data: land
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error rejecting land', 
      error: error.message 
    });
  }
};

// Additional admin methods would follow similar patterns...

module.exports = exports;