import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPropertyForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'villa',
    status: 'sale',
    location: '',
    amenities: '',
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleUploadImages = async () => {
    setUploading(true);
    setError('');
    const token = localStorage.getItem('token');
    const urls = [];
    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        urls.push(data.url);
      } else {
        setError('Image upload failed');
        setUploading(false);
        return;
      }
    }
    setForm((prev) => ({ ...prev, images: urls }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return setError('Not authenticated');
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        amenities: form.amenities.split(',').map((a) => a.trim()),
      }),
    });
    if (res.ok) {
      alert('Property added!');
      navigate('/properties');
    } else {
      setError('Failed to add property');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Property</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="rounded px-3 py-2 border" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="rounded px-3 py-2 border" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="rounded px-3 py-2 border" required />
        <select name="type" value={form.type} onChange={handleChange} className="rounded px-3 py-2 border">
          <option value="villa">Villa</option>
          <option value="penthouse">Penthouse</option>
          <option value="apartment">Apartment</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange} className="rounded px-3 py-2 border">
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="rounded px-3 py-2 border" required />
        <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" className="rounded px-3 py-2 border" />
        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="rounded px-3 py-2 border" />
        <button type="button" onClick={handleUploadImages} disabled={uploading || imageFiles.length === 0} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        {form.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {form.images.map((url, i) => (
              <img key={i} src={url} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition">Add Property</button>
      </form>
    </div>
  );
};

export default AdminPropertyForm; 