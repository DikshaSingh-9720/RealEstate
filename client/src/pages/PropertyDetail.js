import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((res) => res.json())
      .then(setProperty);
    // Check if property is in wishlist
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/properties/wishlist/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((wishlist) => {
          setInWishlist(wishlist.some((p) => p._id === id));
        });
    }
  }, [id]);

  const handleWishlist = async () => {
    setWishlistLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to save properties.');
    const method = inWishlist ? 'DELETE' : 'POST';
    const res = await fetch(`/api/properties/${id}/wishlist`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setInWishlist(!inWishlist);
    setWishlistLoading(false);
  };

  if (!property) return <div className="container mx-auto px-4 py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            {property.images && property.images[0] ? (
              <img src={property.images[0]} alt={property.title} className="object-cover w-full h-full rounded-lg" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          {/* Gallery thumbnails (if more images) */}
          <div className="flex gap-2">
            {property.images && property.images.slice(1).map((img, idx) => (
              <img key={idx} src={img} alt="Gallery" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        </div>
        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{property.title}</h1>
          <div className="text-primary font-bold text-2xl mb-2">₹{property.price.toLocaleString()}</div>
          <div className="text-gray-600 mb-2">{property.location}</div>
          <div className="mb-4 text-gray-700">{property.description}</div>
          <div className="mb-4">
            <span className="font-semibold">Amenities:</span>
            <ul className="list-disc ml-6 text-gray-600">
              {property.amenities && property.amenities.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          {/* Floor plans */}
          {property.floorPlans && property.floorPlans.length > 0 && (
            <div className="mb-4">
              <span className="font-semibold">Floor Plans:</span>
              <div className="flex gap-2 mt-2">
                {property.floorPlans.map((fp, i) => (
                  <img key={i} src={fp} alt="Floor Plan" className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`mt-4 px-6 py-2 rounded font-semibold transition ${inWishlist ? 'bg-red-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}
          >
            {wishlistLoading ? 'Saving...' : inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
          </button>
          {/* Booking Button */}
          <button
            onClick={() => navigate(`/booking/${property._id}`)}
            className="mt-4 ml-4 px-6 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition"
          >
            Book Now
          </button>
          {/* Google Maps placeholder */}
          <div className="mt-6">
            <span className="font-semibold">Location:</span>
            <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 mt-2">
              Google Maps integration coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail; 