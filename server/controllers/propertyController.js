const Property = require('../models/Property');
const User = require('../models/User');

// Create property (admin)
exports.createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all properties with filters
exports.getProperties = async (req, res) => {
  try {
    const { priceMin, priceMax, location, type, status } = req.query;
    let filter = {};
    if (priceMin || priceMax) filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (status) filter.status = status;
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update property (admin)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete property (admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Save property to wishlist
exports.saveToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.savedProperties.includes(req.params.id)) {
      user.savedProperties.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Property saved to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Remove property from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.savedProperties = user.savedProperties.filter(
      (propId) => propId.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Property removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedProperties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 