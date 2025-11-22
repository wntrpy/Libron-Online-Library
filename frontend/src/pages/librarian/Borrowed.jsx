import React, { useState } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import "../../styles/Borrowed.css";
import searchIcon from "../../assets/librarian/searchicon.png";

const initialBorrowed = new Array(7).fill(0).map((_, i) => ({
  id: `2022100${i}`,
  name: "Ruby Cristostomo",
  book: "The Hypocrite World",
  author: "Sophia Hill",
  dateBorrowed: "11/22/2025",
  dueDate: "11/25/2025",
  dateReturned: "N/A",
  status: "Approved",
  cover: "/default-cover.jpg",
}));

export default function Borrowed() {
  const [data, setData] = useState(initialBorrowed);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [returnDate, setReturnDate] = useState("");

  function handleView(row) {
    setSelected(row);
    setReturnDate("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelected(null);
  }

  function handleMarkReturned() {
    setData((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? { ...r, status: "Returned", dateReturned: returnDate || "11/25/2025" }
          : r
      )
    );
    setShowModal(false);
    setShowSuccess(true);
  }

  return (
    <LibrarianLayout title="Borrowed Books">
      <div className="requests-page">
        <div className="requests-header">
          <div className="requests-title">
            <h2>List of Borrowed Books</h2>
          </div>

          <div className="requests-search">
            <div className="search-wrapper">
              <input className="search-input" placeholder="Search" />
              <button className="search-input-icon" aria-label="search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21l-4.35-4.35" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="requests-card">
          <table className="requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>BORROWED BOOK</th>
                <th>DATE BORROWED</th>
                <th>DUE DATE</th>
                <th>DATE RETURNED</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.book}</td>
                  <td>{row.dateBorrowed}</td>
                  <td>{row.dueDate}</td>
                  <td>{row.dateReturned}</td>
                  <td>
                    <span className="status-pill approved">{row.status}</span>
                  </td>
                  <td>
                    <button title="view" className="icon-btn" onClick={() => handleView(row)}>
                      <img className="action-icon" src={searchIcon} alt="view" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for a borrowed item */}
        {showModal && selected && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="borrow-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-top">
                <div className="modal-top-left">
                  <div className="modal-icon">?</div>
                  <div className="modal-title-block">
                    <h3>Borrowed Book</h3>
                    <div className="modal-subtitle">by {selected.id}</div>
                  </div>
                </div>

                <div className="status-section">
                  <span>STATUS</span>
                  <span className={`modal-status-pill ${selected.status === 'Returned' || selected.status === 'Approved' ? 'approved' : 'pending'}`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="modal-content">
                <div className="modal-left">
                  <div className="book-cover-box">
                    {selected.cover ? (
                      <img src={selected.cover} className="book-cover" />
                    ) : (
                      <div className="cover-placeholder">No Image</div>
                    )}
                  </div>

                  <div className="modal-book-title">{selected.book}</div>
                  <div className="modal-book-author">{selected.author}</div>
                </div>

                <div className="modal-right">
                  <div className="modal-row">
                    <strong>Book Genre(s):</strong>
                    <span className="modal-value">Romance</span>
                  </div>

                  <div className="modal-row">
                    <strong>Available Copies:</strong>
                    <span className="modal-value">24</span>
                  </div>

                  <div className="modal-row">
                    <strong>Description:</strong>
                    <p className="modal-desc">Sample description text for the borrowed book.</p>
                  </div>

                  <div className="modal-row">
                    <strong>Borrowed Date:</strong>
                    <span className="modal-value">{selected.dateBorrowed}</span>
                  </div>

                  <div className="modal-row">
                    <strong>Due Date:</strong>
                    <span className="modal-value">{selected.dueDate}</span>
                  </div>

                  <div className="modal-row due-date-row">
                    <strong>Return Date:</strong>
                    <input
                      type="date"
                      value={returnDate}
                      className="due-input"
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-mark" onClick={handleMarkReturned}>
                  Mark as Returned
                </button>
                <button className="btn-close" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success confirmation */}
        {showSuccess && (
          <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
            <div className="success-modal" onClick={(e) => e.stopPropagation()}>
              <div className="success-icon">✓</div>
              <div className="success-title">Return Recorded</div>
              <p className="success-text">The book has been marked as returned.</p>
              <button className="btn-done" onClick={() => setShowSuccess(false)}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </LibrarianLayout>
  );
}
