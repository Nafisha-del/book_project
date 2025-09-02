import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // optional: for styling

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li><Link to="/chat">Chat</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
