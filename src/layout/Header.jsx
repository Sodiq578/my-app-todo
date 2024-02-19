// Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
      
        <div className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>
        <ul className={`header-menu ${menuOpen ? "active" : ""}`}>
          <li className="header-item">
            <Link to="/" className="header-links" onClick={closeMenu}>
              Bosh sahifa
            </Link>
          </li>
          <li className="header-item">
            <Link to="/products" className="header-links" onClick={closeMenu}>
              Mahsulotlar
            </Link>
          </li>
          <li className="header-item">
            <Link to="/qarzlarim" className="header-links" onClick={closeMenu}>
              Qarzlarim
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
