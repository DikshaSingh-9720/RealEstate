require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

// ---------- Luxury Properties ----------
const luxuryProperties = [
  {
    title: 'Skyline Penthouse',
    description: 'A breathtaking penthouse with panoramic city views and luxury amenities.',
    price: 50000000,
    type: 'penthouse',
    status: 'sale',
    location: 'Mumbai, India',
    coordinates: { lat: 19.076, lng: 72.8777 },
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80", // modern penthouse
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1600&q=80"  // city view penthouse
    ],
    amenities: ['Infinity Pool', 'Private Elevator', 'Home Theater', 'Smart Home'],
    floorPlans: [],
  },
  {
    title: 'Palm Villa',
    description: 'A modern villa with private beach access and lush gardens.',
    price: 35000000,
    type: 'villa',
    status: 'sale',
    location: 'Goa, India',
    coordinates: { lat: 15.2993, lng: 74.124 },
    images: [
      "https://images.unsplash.com/photo-1616486022435-6b5d8b3e39d2?auto=format&fit=crop&w=1600&q=80", // beach villa
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80"  // luxury interior
    ],
    amenities: ['Private Beach', 'Jacuzzi', 'Gym', 'Wine Cellar'],
    floorPlans: [],
  },
  {
    title: 'Central Park Apartment',
    description: 'A luxury apartment overlooking Central Park with world-class facilities.',
    price: 20000000,
    type: 'apartment',
    status: 'rent',
    location: 'New York, USA',
    coordinates: { lat: 40.7851, lng: -73.9683 },
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed7b17d3?auto=format&fit=crop&w=1600&q=80", // high-rise luxury
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80"  // central park view
    ],
    amenities: ['Doorman', 'Fitness Center', 'Rooftop Lounge', 'Concierge'],
    floorPlans: [],
  },
];

// ---------- Agricultural Properties ----------
const agriculturalProperties = [
  {
    title: 'Organic Wheat Farm',
    description: 'Lush wheat fields with irrigation and farmhouse setup.',
    price: 4500000,
    type: 'farm',
    status: 'sale',
    location: 'Punjab, India',
    coordinates: { lat: 30.7333, lng: 76.7794 },
    images: [
      "https://images.unsplash.com/photo-1598032893314-d3b16e78c5a2?auto=format&fit=crop&w=1600&q=80", // wheat field
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80" // sunny farm
    ],
    amenities: ['Irrigation', 'Storage Barn', 'Tractor Shed', 'Farmhouse'],
    floorPlans: [],
  },
  {
    title: 'Luxury Mango Orchard',
    description: 'Mango orchard with luxury villa and organic certification.',
    price: 6000000,
    type: 'orchard',
    status: 'sale',
    location: 'Maharashtra, India',
    coordinates: { lat: 19.7515, lng: 75.7139 },
    images: [
      "https://images.unsplash.com/photo-1605487916261-54cfec1a0daa?auto=format&fit=crop&w=1600&q=80", // mango trees
      "https://images.unsplash.com/photo-1563201515-adbe917e6206?auto=format&fit=crop&w=1600&q=80" // orchard road
    ],
    amenities: ['Organic Farming', 'Irrigation', 'Storage House', 'Villa'],
    floorPlans: [],
  },
  {
    title: 'Farmhouse with Rice Fields',
    description: 'Beautiful farmhouse surrounded by lush rice paddies.',
    price: 8500000,
    type: 'farmhouse',
    status: 'sale',
    location: 'Kerala, India',
    coordinates: { lat: 10.8505, lng: 76.2711 },
    images: [
      "https://images.unsplash.com/photo-1584270354949-1d5e4071ef99?auto=format&fit=crop&w=1600&q=80", // rice fields
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1600&q=80" // farmhouse front view
    ],
    amenities: ['Farmhouse', 'Organic Crops', 'Storage Barn', 'Eco-Friendly Setup'],
    floorPlans: [],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dataset = process.argv[2] === 'agriculture' ? agriculturalProperties : luxuryProperties;

    await Property.deleteMany();
    await Property.insertMany(dataset);

    console.log(`✅ Seeded ${process.argv[2] || 'luxury'} properties successfully!`);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

seed();
