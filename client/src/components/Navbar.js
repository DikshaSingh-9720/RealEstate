import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="navbar-logo" className="logo-img" />
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/properties">Properties</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <Link to="/properties" onClick={() => setMenuOpen(false)}>Properties</Link>
        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
