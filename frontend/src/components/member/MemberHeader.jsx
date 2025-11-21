// frontend/src/components/member/Header.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MemberHeader() {
    console.log("🔥 HEADER IS LOADING - NEW VERSION");

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      width: '100%',
      backgroundColor: 'white',
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ width: '100%', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Left Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button
              onClick={() => navigate('/member/dashboard')}
              style={{
                fontWeight: '500',
                fontSize: '1.125rem',
                color: isActive('/member/dashboard') ? '#EAB308' : '#374151',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              E-Catalog
            </button>

            <button
              onClick={() => navigate('/member/saved-books')}
              style={{
                fontWeight: '500',
                fontSize: '1.125rem',
                color: isActive('/member/saved-books') ? '#EAB308' : '#374151',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              Saved Books
            </button>
          </div>

          {/* Center Logo (Not Clickable) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/src/assets/app_icon.png"
              alt="Libron Logo"
              style={{ height: '4rem', width: 'auto' }}
            />
          </div>

          {/* Right Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <button
              onClick={() => navigate('/member/borrows')}
              style={{
                fontWeight: '500',
                fontSize: '1.125rem',
                color: isActive('/member/borrows') ? '#EAB308' : '#374151',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              Borrows
            </button>

            <button
              onClick={() => navigate('/member/about-us')}
              style={{
                fontWeight: '500',
                fontSize: '1.125rem',
                color: isActive('/member/about-us') ? '#EAB308' : '#374151',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              About Us
            </button>

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
          </div>
        </div>
      </div>
    </header>
  );
}