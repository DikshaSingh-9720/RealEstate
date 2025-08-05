const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  // Land and users involved
  land: { type: mongoose.Schema.Types.ObjectId, ref: 'AgriculturalLand', required: true },
  inquirer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  landOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Inquiry details
  subject: { type: String, required: true },
  message: { type: String, required: true },
  
  // Inquiry type
  inquiryType: {
    type: String,
    enum: ['general', 'pricing', 'visit-request', 'document-request', 'negotiation'],
    required: true,
    default: 'general'
  },
  
  // Contact preferences
  preferredContactMethod: {
    type: String,
    enum: ['phone', 'email', 'whatsapp', 'in-person'],
    default: 'phone'
  },
  
  contactNumber: { type: String },
  
  // Visit details (if inquiry type is visit-request)
  visitDetails: {
    preferredDate: { type: Date },
    preferredTime: { type: String },
    visitDuration: { type: String }, // e.g., "2 hours", "half day"
    numberOfVisitors: { type: Number, default: 1 }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'replied', 'in-discussion', 'visit-scheduled', 'closed', 'declined'],
    default: 'pending'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Follow-up conversations
  replies: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    attachments: [{ type: String }] // URLs to any attached files
  }],
  
  // Important dates
  lastReplyAt: { type: Date },
  closedAt: { type: Date },
  
  // Admin notes (for dispute resolution or special cases)
  adminNotes: { type: String },
  
  // Metrics
  responseTime: { type: Number }, // in hours
  isRead: {
    byInquirer: { type: Boolean, default: false },
    byLandOwner: { type: Boolean, default: false }
  },
  
  // Rating after inquiry completion
  rating: {
    byInquirer: { type: Number, min: 1, max: 5 },
    byLandOwner: { type: Number, min: 1, max: 5 }
  },
  
  feedback: {
    byInquirer: { type: String },
    byLandOwner: { type: String }
  }
  
}, { timestamps: true });

// Add indexes for better performance
inquirySchema.index({ land: 1, status: 1 });
inquirySchema.index({ inquirer: 1, status: 1 });
inquirySchema.index({ landOwner: 1, status: 1 });
inquirySchema.index({ status: 1, priority: 1 });
inquirySchema.index({ createdAt: -1 });

// Virtual for reply count
inquirySchema.virtual('replyCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Method to mark as read
inquirySchema.methods.markAsRead = function(userType) {
  if (userType === 'inquirer') {
    this.isRead.byInquirer = true;
  } else if (userType === 'landOwner') {
    this.isRead.byLandOwner = true;
  }
  return this.save();
};

// Method to add reply
inquirySchema.methods.addReply = function(senderId, message, attachments = []) {
  this.replies.push({
    sender: senderId,
    message: message,
    attachments: attachments
  });
  this.lastReplyAt = new Date();
  this.status = 'replied';
  return this.save();
};

module.exports = mongoose.model('Inquiry', inquirySchema);