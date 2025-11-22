import "../../styles/Header.css";
import profileIcon from "../../assets/librarian/profile-icon.png";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ title }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [librarianName, setLibrarianName] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get librarian name from sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (storedUser.name) {
      // Extract first name from full name
      const firstName = storedUser.name.split(' ')[0];
      setLibrarianName(firstName);
    }
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleLogoutConfirm() {
    setConfirmOpen(false);
    // perform logout cleanup here if needed
    navigate("/login");
  }

  // If a title is provided, display it in header and highlight last word
  const renderTitle = () => {
    if (!title) {
      return (
        <h1>
          Welcome Librarian, <span>{librarianName || 'User'}!</span>
        </h1>
      );
    }

    const parts = String(title).split(" ");
    const last = parts.pop();
    const first = parts.join(" ");
    return (
      <h1 className="page-title">
        {first} {first ? <span>{last}</span> : <span>{last}</span>}
      </h1>
    );
  };

  return (
    <header className="main-header">
      {renderTitle()}

      <div className="profile-wrap" ref={dropdownRef}>
        <img
          className="profile-icon"
          src={profileIcon}
          alt="profile"
          onClick={() => setOpen((v) => !v)}
        />

        {open && (
          <div className="profile-dropdown">
            <button
              className="dropdown-btn"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="logout-icon"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}

        {confirmOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}>
            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes popIn {
                  0% {
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                  }
                  60% {
                    transform: scale(1.05);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                }
              `}
            </style>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              width: '400px',
              maxWidth: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: '700',
                margin: '0 auto 16px'
              }}>
                ⚠
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                color: '#1f2937'
              }}>
                Confirm Logout
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 24px 0',
                lineHeight: '1.5'
              }}>
                Are you sure you want to logout?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  style={{
                    padding: '10px 24px',
                    background: '#ffffff',
                    color: '#6b7280',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: '10px 24px',
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#b91c1c';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.3)';
                  }}
                  onClick={handleLogoutConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
