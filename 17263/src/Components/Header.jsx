// File: src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <header>
      <a href="#" className="logo">
        Σ𝗘𝗗𝗜𝗖𝗢𝗦|
        <sub className="logo-sub">Ⴘour online medical store</sub>
      </a>

      <ul className="navbar">
        <li>
          <a href="#medicine">MEDICINE</a>
        </li>
        <li>
          <a href="#babycare">BABYCARE</a>
        </li>
        <li>
          <a href="#skincare">SKINCARE</a>
        </li>
        <li>
          <a href="#ayurveda">AYURVEDA</a>
        </li>
      </ul>
      <div className="icons">
        <a href="#">
          <i className="bx bx-search"></i>
        </a>
        <a href="#" id="cart-icon">
          <i className="bx bxs-cart"></i>
          <span id="cart-count">0</span>
        </a>
        <a href="/form">
          <i className="bx bxs-user-circle"></i>
        </a>
      </div>
    </header>
  );
};

export default Header;
