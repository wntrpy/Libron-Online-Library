// frontend/src/components/member/Header.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MemberHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left Navigation */}
        <nav className="flex items-center space-x-8">
          <button
            onClick={() => navigate('/member/dashboard')}
            className={`text-lg font-medium ${isActive('/member/dashboard') ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 transition-colors`}
          >
            E-Catalog
          </button>
          <button
            onClick={() => navigate('/member/saved-books')}
            className={`text-lg font-medium ${isActive('/member/saved-books') ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 transition-colors`}
          >
            Saved Books
          </button>
          <button
            onClick={() => navigate('/member/borrows')}
            className={`text-lg font-medium ${isActive('/member/borrows') ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 transition-colors`}
          >
            Borrows
          </button>
          <button
            onClick={() => navigate('/member/about-us')}
            className={`text-lg font-medium ${isActive('/member/about-us') ? 'text-yellow-500' : 'text-gray-700'} hover:text-yellow-500 transition-colors`}
          >
            About Us
          </button>
        </nav>

        {/* Center Logo */}
        <div className="flex items-center justify-center">
          <img
            src="/src/assets/app_icon.png"
            alt="Libron Logo"
            className="h-14 w-auto"
          />
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center space-x-8 justify-end">
          <button
            onClick={() => navigate('/member/my-account')}
            style={{
              backgroundColor: '#FBBF24',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#111827',
              fontWeight: '600',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            My Account
          </button>
        </nav>
      </div>
    </header>
  );
}