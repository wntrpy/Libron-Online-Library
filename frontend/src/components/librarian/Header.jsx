import "../../styles/Header.css";
import profileIcon from "../../assets/librarian/profile-icon.png";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ title }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
          Welcome Librarian, <span>Dave!</span>
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
          <div className="confirm-modal">
            <div className="confirm-box">
              <p>Are you sure you want to logout?</p>
              <div className="confirm-actions">
                <button className="btn cancel" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </button>
                <button className="btn confirm" onClick={handleLogoutConfirm}>
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
