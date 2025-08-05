import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const API_URL = "http://localhost:5000/api"; // centralize API URL

// Fetch user profile
const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};

// Fetch wishlist
const fetchWishlist = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/properties/wishlist/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const navigate = useNavigate();

  // Sync edit fields when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || "");
    }
  }, [user]);

  // Save updated profile
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName, phone: editPhone }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setIsEditing(false);
    } else {
      alert(data.message || "Update failed");
    }
  };

  // Load profile & wishlist
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchProfile();
        setUser(userData);
        const wishlistData = await fetchWishlist();
        setWishlist(wishlistData);
      } catch (err) {
        setError("Please login to view your profile.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  // Avatar upload handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // show preview instantly

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/avatar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setUser((prev) => ({ ...prev, avatar: data.avatar }));
    } else {
      alert(data.message || "Failed to upload avatar");
    }
  };

  if (loading) return <div className="profile-container">Loading your profile...</div>;
  if (error) return <div className="profile-container error">{error}</div>;

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className={`profile-card ${isEditing ? "edit-mode" : ""}`}>
        <div className="profile-avatar">
          <img
            src={
              preview ||
              user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="avatar"
            className="avatar-img"
          />
          <label className="avatar-upload-btn">
            Change Photo
            <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
          </label>
        </div>

        <div className="user-details">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
              />
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Phone number"
              />
              <button onClick={handleSave} className="edit-btn">Save</button>
              <button
                onClick={() => setIsEditing(false)}
                className="edit-btn cancel"
                style={{ background: "#ccc", color: "#333" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              {user.phone && <p>📞 {user.phone}</p>}
              {user.createdAt && (
                <p className="join-date">
                  Joined on {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="wishlist-header">
        <h2 className="wishlist-title">My Wishlist ({wishlist.length})</h2>
      </div>

      <div className="wishlist-grid">
        {wishlist.length === 0 && <div className="no-wishlist">No saved properties yet.</div>}

        {wishlist.map((property) => (
          <Link to={`/properties/${property._id}`} key={property._id} className="wishlist-card">
            <div className="wishlist-image">
              {property.images && property.images[0] ? (
                <img src={property.images[0]} alt={property.title} />
              ) : (
                <span>No Image</span>
              )}
              {property.status && (
                <span className={`status-badge ${property.status}`}>
                  {property.status.toUpperCase()}
                </span>
              )}
            </div>
            <div className="wishlist-info">
              <h3>{property.title}</h3>
              <p className="price">₹{property.price.toLocaleString()}</p>
              <p className="location">{property.location}</p>
              <p className="type">{property.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profile;
