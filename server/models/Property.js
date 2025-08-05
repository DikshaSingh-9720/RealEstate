const mongoose = require('mongoose');

const agriculturalLandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  pricePerAcre: { type: Number, required: true },
  
  // Land type - focused on agricultural land types
  landType: { 
    type: String, 
    enum: [
      'cropland', 'pasture', 'orchard', 'vineyard', 
      'dairy-farm', 'poultry-farm', 'mixed-farming', 
      'organic-certified', 'greenhouse'
    ], 
    required: true 
  },
  
  // Size details
  totalArea: { type: Number, required: true }, // in acres
  cultivableArea: { type: Number, required: true }, // in acres
  irrigatedArea: { type: Number, default: 0 }, // in acres
  
  // Status
  status: { type: String, enum: ['sale', 'lease', 'rent'], required: true },
  leaseType: { 
    type: String, 
    enum: ['short-term', 'long-term', 'seasonal'], 
    required: function() { return this.status === 'lease' || this.status === 'rent'; }
  },
  
  // Location details
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  
  // Agricultural specifications
  soilType: { 
    type: String, 
    enum: [
      'alluvial', 'black-cotton', 'red-laterite', 'sandy', 
      'clay', 'loamy', 'saline', 'alkaline'
    ], 
    required: true 
  },
  
  soilQuality: { 
    type: String, 
    enum: ['excellent', 'good', 'average', 'poor'], 
    required: true 
  },
  
  // Crop suitability
  suitableCrops: [{
    type: String,
    enum: [
      'wheat', 'rice', 'corn', 'soybeans', 'cotton', 'sugarcane',
      'vegetables', 'fruits', 'pulses', 'spices', 'flowers',
      'fodder', 'medicinal-plants', 'organic-farming'
    ]
  }],
  
  // Water resources
  waterSources: [{
    type: String,
    enum: [
      'borewell', 'tube-well', 'canal', 'river', 'pond', 
      'rainwater-harvesting', 'drip-irrigation', 'sprinkler'
    ]
  }],
  
  waterAvailability: { 
    type: String, 
    enum: ['year-round', 'seasonal', 'monsoon-dependent', 'limited'], 
    required: true 
  },
  
  // Infrastructure
  infrastructure: {
    electricity: { type: Boolean, default: false },
    roadAccess: { 
      type: String, 
      enum: ['paved', 'unpaved', 'seasonal', 'no-access'], 
      default: 'unpaved' 
    },
    storage: { type: Boolean, default: false },
    farmHouse: { type: Boolean, default: false },
    boundary: { 
      type: String, 
      enum: ['fenced', 'walled', 'marked', 'none'], 
      default: 'marked' 
    }
  },
  
  // Environmental factors
  climate: { 
    type: String, 
    enum: ['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'], 
    required: true 
  },
  
  rainfall: { 
    type: String, 
    enum: ['heavy', 'moderate', 'low', 'very-low'], 
    required: true 
  },
  
  // Legal and documentation
  landDocuments: {
    hasTitle: { type: Boolean, default: false },
    surveyNumber: { type: String },
    khataNumber: { type: String },
    clearTitle: { type: Boolean, default: false }
  },
  
  // Media
  images: [{ type: String }], // Cloudinary URLs
  documents: [{ type: String }], // Document URLs (soil reports, surveys, etc.)
  
  // Approval status for admin workflow
  approvalStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'under-review'], 
    default: 'pending' 
  },
  
  adminComments: { type: String },
  
  // Owner/Farmer details
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Engagement metrics
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  
  // Featured listing
  isFeatured: { type: Boolean, default: false },
  
}, { timestamps: true });

// Add indexes for better search performance
agriculturalLandSchema.index({ 'location.coordinates': '2dsphere' });
agriculturalLandSchema.index({ landType: 1, status: 1 });
agriculturalLandSchema.index({ suitableCrops: 1 });
agriculturalLandSchema.index({ pricePerAcre: 1 });
agriculturalLandSchema.index({ totalArea: 1 });
agriculturalLandSchema.index({ approvalStatus: 1 });

module.exports = mongoose.model('AgriculturalLand', agriculturalLandSchema); 