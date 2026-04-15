import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-sm">⏳</span>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              TimeCapsule
            </span>
          </Link>

          {/* HAMBURGER */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-white hover:scale-110 transition"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-20 right-4 w-64 
        bg-black/90 backdrop-blur-xl 
        border border-white/20 
        rounded-2xl shadow-xl 
        z-50 transform transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-10 opacity-0 pointer-events-none"
        }`}
      >

        {/* CLOSE */}
        <div className="flex justify-end p-3 border-b border-white/20">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-400 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-col">

          {/* HOME (FIRST - NO BORDER) */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 text-white text-sm tracking-wide 
            hover:bg-white/5 hover:pl-8 
            transition-all duration-300"
          >
            Home
          </Link>

          {/* SIGNUP */}
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 text-white text-sm tracking-wide 
            border-t border-white/20
            hover:bg-white/5 hover:pl-8 
            transition-all duration-300"
          >
            Sign Up
          </Link>

          {/* LOGIN */}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 text-white text-sm tracking-wide 
            border-t border-white/20
            hover:bg-white/5 hover:pl-8 
            transition-all duration-300"
          >
            Login
          </Link>

          {/* ABOUT */}
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 text-white text-sm tracking-wide 
            border-t border-white/20
            hover:bg-white/5 hover:pl-8 
            transition-all duration-300"
          >
            About
          </Link>

          {/* CONTACT */}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 text-white text-sm tracking-wide 
            border-t border-white/20
            hover:bg-white/5 hover:pl-8 
            transition-all duration-300"
          >
            Contact
          </Link>

        </div>
      </div>
    </>
  );
};

export default Navbar;