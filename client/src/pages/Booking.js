import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Booking = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((res) => res.json())
      .then(setProperty)
      .catch(() => setError('Property not found'));
  }, [id]);

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to book this property.');
      setLoading(false);
      return;
    }
    // Load Razorpay script
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      setError('Failed to load Razorpay SDK');
      setLoading(false);
      return;
    }
    // Create order on backend
    const orderRes = await fetch('/api/bookings/razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: property.price }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      setError(orderData.message || 'Failed to create order');
      setLoading(false);
      return;
    }
    // Open Razorpay modal
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxx', // fallback for dev
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'LuxuryEstates',
      description: property.title,
      order_id: orderData.id,
      handler: async function (response) {
        // Create booking in backend
        const bookingRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            property: property._id,
            amount: property.price,
            razorpayPaymentId: response.razorpay_payment_id,
          }),
        });
        if (bookingRes.ok) {
          alert('Booking successful!');
          navigate('/profile');
        } else {
          setError('Booking failed. Please contact support.');
        }
      },
      prefill: {},
      theme: { color: '#1e293b' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (error) return <div className="container mx-auto px-4 py-12">{error}</div>;
  if (!property) return <div className="container mx-auto px-4 py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Book Property</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-2"><span className="font-semibold">Property:</span> {property.title}</div>
        <div className="mb-2"><span className="font-semibold">Location:</span> {property.location}</div>
        <div className="mb-2"><span className="font-semibold">Price:</span> ₹{property.price.toLocaleString()}</div>
      </div>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition w-full"
      >
        {loading ? 'Processing...' : 'Pay & Book Now'}
      </button>
    </div>
  );
};

export default Booking; 