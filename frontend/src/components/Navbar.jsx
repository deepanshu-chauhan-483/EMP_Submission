import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-white font-bold text-lg hover:text-blue-200 transition-colors duration-300"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/create-event"
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-blue-100 transition-colors duration-300"
            >
              Create Event
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;