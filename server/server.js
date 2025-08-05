const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

const { connectDb } = require("./utils/db")

// Middleware
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Luxury Real Estate API');
});

const port = process.env.PORT || 5000;

connectDb().then(() => {
    app.listen(port, (req, res) => {
        console.log(`Server is listening on ${port}`)
    })
});