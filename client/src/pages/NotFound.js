import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container mx-auto px-4 py-12 text-center">
    <h1 className="text-4xl font-bold mb-4 text-gray-900">404 - Page Not Found</h1>
    <p className="mb-8 text-gray-600">Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="text-primary font-semibold hover:underline">Go Home</Link>
  </div>
);

export default NotFound; 