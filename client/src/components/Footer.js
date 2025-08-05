import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} AgriLux Estates. All Rights Reserved.</p>
        <p>
          <Link to="/about">About Us</Link> | <Link to="/contact">Contact</Link> |{" "}
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
