const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  enum: [
  'penthouse', 'villa', 'apartment',   // luxury
  'farm', 'orchard', 'farmhouse',      // agricultural
],
  status: { type: String, enum: ['rent', 'sale'], required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  images: [{ type: String }], // Cloudinary URLs
  amenities: [{ type: String }],
  floorPlans: [{ type: String }], // URLs or file references
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema); 