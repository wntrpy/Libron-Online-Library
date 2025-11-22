import React, { useState } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import "../../styles/Requests.css";
import searchIcon from "../../assets/librarian/searchicon.png";

export default function Requests() {
  const authors = [
    "Sophia Hill",
    "James Walker",
    "Ava Martinez",
    "Liam Johnson",
    "Olivia Brown",
    "Noah Davis",
    "Emma Wilson",
  ];

  const sample = new Array(7).fill(0).map((_, i) => ({
    id: `2022100${i}`,
    fullName: "Ruby Cristostomo",
    email: "Ruby@GDT.com",
    book: "The Hypocrite World",
    author: authors[i % authors.length],
    genre: "Romance",
    description:
      "Sobrang gandang isturi tapos nag kiss ang mga bida, oo totoo yun tanga hahahaha tapos na feature sila sa sulasok tv gago lupet nyan tol oo",
    availableCopies: 24,
    date: "11/22/2025",
    cover: "/default-cover.jpg", // replace with Django image later
    status: "Pending",
  }));

  const [data, setData] = useState(sample);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dueDate, setDueDate] = useState("");

  function handleView(row) {
    setSelected(row);
    setDueDate("");
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelected(null);
  }

  function handleApprove() {
    if (!selected) return;
    setData((prev) => {
      const next = prev.map((r) => (r.id === selected.id ? { ...r, status: "Approved" } : r));
      // small debug log to confirm state change
      console.log("Requests: approving", selected.id, next);
      return next;
    });
    setSelected((s) => (s ? { ...s, status: "Approved" } : s));
    setShowModal(false);
    setShowSuccess(true);
  }

  return (
    <LibrarianLayout title="Borrow Requests">
      <div className="requests-page">
        <div className="requests-header">
          <h2>List of Borrow Requests</h2>

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
          <div className="table-scroll">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>FULL NAME</th>
                  <th>EMAIL ADDRESS</th>
                  <th>BORROWED BOOK</th>
                  <th>DATE BORROWED</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.fullName}</td>
                    <td>{row.email}</td>
                    <td>{row.book}</td>
                    <td>{row.date}</td>

                    <td>
                      <span
                        className={`status-pill ${
                          row.status === "Approved" ? "approved" : ""
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td>
                      <button
                        title="view"
                        className="icon-btn"
                        onClick={() => handleView(row)}
                      >
                        <img className="action-icon" src={searchIcon} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===========================
            MODAL (DESIGN MATCHING IMAGE)
        ============================ */}
        {showModal && selected && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="borrow-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-top">
                <div className="modal-top-left">
                  <div className="modal-icon">?</div>
                  <div className="modal-title-block">
                    <h3>Borrow Request</h3>
                    <div className="modal-subtitle">by {selected.id}</div>
                  </div>
                </div>

                <div className="status-section">
                  <span>STATUS</span>
                  <span className={`modal-status-pill ${selected.status === 'Approved' ? 'approved' : 'pending'}`}>
                    {selected.status}
                  </span>
                </div>

              </div>

              <div className="modal-content">
                {/* LEFT SIDE */}
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

                {/* RIGHT SIDE */}
                <div className="modal-right">
                  <div className="modal-row">
                    <strong>Book Genre(s):   </strong> {selected.genre}
                  </div>

                  <div className="modal-row">
                    <strong>Available Copies:   </strong>{" "}
                    {selected.availableCopies}
                  </div>

                  <div className="modal-row">
                    <strong>Description:</strong>
                    <p className="modal-desc">{selected.description}</p>
                  </div>

                  <div className="modal-row">
                    <strong>Borrowed Date:   </strong> {selected.date}
                  </div>

                  <div className="modal-row due-date-row">
                    <strong>Set Due Date:</strong>
                    <input
                      type="date"
                      value={dueDate}
                      className="due-input"
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-approve" onClick={handleApprove}>
                    Approve Request
                  </button>
                  <button className="btn-close" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS MODAL */}
          {showSuccess && (
            <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
              <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                <div className="success-icon">✓</div>
                <div className="success-title">Request Approved</div>
                <p className="success-text">The borrow request has been approved successfully.</p>

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
