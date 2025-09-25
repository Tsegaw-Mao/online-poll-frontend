// src/layout/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, isAuthenticated }) => (
  <header className="p-4 bg-gray-200 flex gap-4">
    <Link to="/">Home</Link>
    <Link to="/create/polls/">Create Poll</Link>

    {!isAuthenticated && (
      <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </>
    )}

    {isAuthenticated && (
      <button onClick={onLogout} className="text-red-600 hover:underline">
        Logout
      </button>
    )}
  </header>
);

export default Header;
