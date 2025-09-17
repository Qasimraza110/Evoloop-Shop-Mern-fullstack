import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";
import { FaShoppingCart, FaUser, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white px-4 md:px-8 py-4 flex justify-between items-center relative z-50">
      {/* Logo */}
      <Link
        to="/"
        className="font-bold text-xl hover:text-yellow-400 transition-colors duration-200"
      >
        Evoloop <span className="text-yellow-400">Shop</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-yellow-400 transition-colors duration-200">Home</Link>
        <Link to="/about" className="hover:text-yellow-400 transition-colors duration-200">About Us</Link>
        <Link to="/products" className="hover:text-yellow-400 transition-colors duration-200">Products</Link>
        <Link to="/contact" className="hover:text-yellow-400 transition-colors duration-200">Contact Us</Link>
        <Link to="/cart" className="hover:text-yellow-400 transition-colors duration-200 flex items-center gap-1">
          <FaShoppingCart className="text-yellow-400" /> Cart
        </Link>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="hover:text-yellow-400 transition-colors duration-200"
            >
              Welcome, {user.username}
            </button>
            {dropdown && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-44 z-50">
                <Link
                  className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  to="/profile"
                  onClick={() => setDropdown(false)}
                >
                  <FaUser /> Profile
                </Link>
                <Link
                  className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  to="/orders"
                  onClick={() => setDropdown(false)}
                >
                  <FaClipboardList /> My Orders
                </Link>
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  onClick={() => {
                    logout();
                    setDropdown(false);
                    navigate("/");
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-400 transition-colors duration-200">Login</Link>
            <Link to="/signup" className="hover:text-yellow-400 transition-colors duration-200">Signup</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <HiX /> : <HiMenu />}
      </button>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute top-full left-0 w-full bg-black flex flex-col items-center gap-4 py-4 md:hidden">
          <Link to="/" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200">Home</Link>
          <Link to="/about" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200">About Us</Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200"
              >
                <FaUser /> Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200"
              >
                <FaClipboardList /> My Orders
              </Link>
              <button
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200"
                onClick={() => {
                  logout();
                  setMobileMenu(false);
                  navigate("/");
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200">Login</Link>
              <Link to="/signup" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200">Signup</Link>
            </>
          )}

          <Link to="/products" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200">Products</Link>
          <Link to="/contact" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200">Contact Us</Link>
          <Link to="/cart" onClick={() => setMobileMenu(false)} className="hover:text-yellow-400 transition-colors duration-200 flex items-center gap-1">
            <FaShoppingCart className="text-yellow-400" /> Cart
          </Link>
        </div>
      )}
    </nav>
  );
}
