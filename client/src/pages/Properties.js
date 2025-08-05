import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Properties.css';

const fetchProperties = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/properties?${params}`);
  return res.json();
};

const fetchWishlist = async () => {
  const token = localStorage.getItem('token');
  if (!token) return [];
  const res = await fetch('/api/properties/wishlist/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
};

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ priceMin: '', priceMax: '', location: '', type: '' });
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  useEffect(() => {
    fetchProperties(filters).then(setProperties);
  }, [filters]);

  useEffect(() => {
    fetchWishlist().then(setWishlist);
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleWishlist = async (propertyId, inWishlist) => {
    setWishlistLoading((prev) => ({ ...prev, [propertyId]: true }));
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save properties.');
      setWishlistLoading((prev) => ({ ...prev, [propertyId]: false }));
      return;
    }
    const method = inWishlist ? 'DELETE' : 'POST';
    const res = await fetch(`/api/properties/${propertyId}/wishlist`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setWishlist((prev) =>
        inWishlist
          ? prev.filter((p) => p._id !== propertyId)
          : [...prev, { _id: propertyId }]
      );
    }
    setWishlistLoading((prev) => ({ ...prev, [propertyId]: false }));
  };

  const isInWishlist = (propertyId) => wishlist.some((p) => p._id === propertyId);

  return (
    <div className="properties-page">
      <h1 className="properties-title">Browse Properties</h1>

      {/* Filters */}
      <div className="filters-bar">
        <input name="location" value={filters.location} onChange={handleChange} placeholder="Location" />
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">All Types</option>
          <option value="villa">Villa</option>
          <option value="penthouse">Penthouse</option>
          <option value="apartment">Apartment</option>
        </select>
        <input name="priceMin" value={filters.priceMin} onChange={handleChange} placeholder="Min Price" type="number" />
        <input name="priceMax" value={filters.priceMax} onChange={handleChange} placeholder="Max Price" type="number" />
      </div>

      {/* Property Cards */}
      <div className="properties-grid">
        {properties.length === 0 && (
          <div className="no-properties">No properties found.</div>
        )}
        {properties.map((property) => {
          const inWishlist = isInWishlist(property._id);
          return (
            <div key={property._id} className="property-card">
              <Link to={`/properties/${property._id}`}>
                <div className="property-image">
                  {property.images && property.images[0] ? (
                    <img src={property.images[0]} alt={property.title} />
                  ) : (
                    <span className="no-image">No Image</span>
                  )}
                </div>
                <div className="property-details">
                  <h2>{property.title}</h2>
                  <div className="price">₹{property.price.toLocaleString()}</div>
                  <div className="location">{property.location}</div>
                  <div className="type">{property.type}</div>
                </div>
              </Link>
              <button
                onClick={() => handleWishlist(property._id, inWishlist)}
                disabled={wishlistLoading[property._id]}
                className={`wishlist-btn ${inWishlist ? 'remove' : 'save'}`}
              >
                {wishlistLoading[property._id]
                  ? 'Saving...'
                  : inWishlist
                  ? 'Remove'
                  : 'Save'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Properties;
