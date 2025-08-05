const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Profile information
  avatar: {
    type: String,
    default: "", // empty if not uploaded
  },
  
  // User type and role
  userType: { 
    type: String, 
    enum: ['farmer', 'buyer', 'agent', 'admin'], 
    required: true,
    default: 'farmer'
  },
  
  isAdmin: { type: Boolean, default: false },
  
  // Farmer-specific fields
  farmerProfile: {
    farmingExperience: { 
      type: Number, // years of experience
      required: function() { return this.userType === 'farmer'; }
    },
    
    cropsGrown: [{
      type: String,
      enum: [
        'wheat', 'rice', 'corn', 'soybeans', 'cotton', 'sugarcane',
        'vegetables', 'fruits', 'pulses', 'spices', 'flowers',
        'fodder', 'medicinal-plants', 'organic-farming'
      ]
    }],
    
    farmSize: { type: Number }, // total farm size in acres
    
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String }
    },
    
    // Verification status
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{
      type: String, // URLs to uploaded documents
    }],
    
    verificationStatus: { 
      type: String, 
      enum: ['pending', 'verified', 'rejected', 'under-review'], 
      default: 'pending' 
    },
    
    // Additional farmer details
    organicCertified: { type: Boolean, default: false },
    cooperativeMember: { type: Boolean, default: false },
    languages: [{ type: String }], // languages spoken
    
    // Contact preferences
    preferredContactMethod: { 
      type: String, 
      enum: ['phone', 'email', 'whatsapp'], 
      default: 'phone' 
    },
    
    // Ratings and reviews
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
  },
  
  // Buyer-specific fields
  buyerProfile: {
    interestedCrops: [{
      type: String,
      enum: [
        'wheat', 'rice', 'corn', 'soybeans', 'cotton', 'sugarcane',
        'vegetables', 'fruits', 'pulses', 'spices', 'flowers',
        'fodder', 'medicinal-plants', 'organic-farming'
      ]
    }],
    
    preferredLocations: [{
      city: { type: String },
      state: { type: String }
    }],
    
    budgetRange: {
      min: { type: Number },
      max: { type: Number }
    },
    
    landSizePreference: {
      min: { type: Number }, // in acres
      max: { type: Number }  // in acres
    }
  },
  
  // Saved and favorited lands
  savedLands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgriculturalLand' }],
  
  // Inquiries made/received
  inquiriesMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' }],
  inquiriesReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' }],
  
  // Account status
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  
  // Notification preferences
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  
  // Google OAuth fields
  googleId: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  
  // Email verification fields
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  
  // Password reset fields
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  
}, { timestamps: true });

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'farmerProfile.isVerified': 1 });
userSchema.index({ 'farmerProfile.cropsGrown': 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'farmerProfile.location.city': 1, 'farmerProfile.location.state': 1 });

module.exports = mongoose.model('User', userSchema); 