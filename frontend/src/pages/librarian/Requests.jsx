import React, { useState, useEffect } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import "../../styles/Requests.css";
import searchIcon from "../../assets/librarian/searchicon.png";

const API_URL = "http://localhost:8000/api/borrow-requests/";

export default function Requests() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch pending requests on component mount
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Filter and sort data when search term or sort config changes
  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      result = result.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const memberName = `${item.member?.first_name || ''} ${item.member?.last_name || ''}`.toLowerCase();
        const bookTitle = item.book?.title?.toLowerCase() || '';
        const studentNumber = item.member?.student_number?.toString() || '';
        const email = item.member?.email?.toLowerCase() || '';
        
        return (
          memberName.includes(searchLower) ||
          bookTitle.includes(searchLower) ||
          studentNumber.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        switch(sortConfig.key) {
          case 'id':
            aValue = a.member?.student_number || '';
            bValue = b.member?.student_number || '';
            break;
          case 'name':
            aValue = `${a.member?.first_name || ''} ${a.member?.last_name || ''}`;
            bValue = `${b.member?.first_name || ''} ${b.member?.last_name || ''}`;
            break;
          case 'email':
            aValue = a.member?.email || '';
            bValue = b.member?.email || '';
            break;
          case 'book':
            aValue = a.book?.title || '';
            bValue = b.book?.title || '';
            break;
          case 'date':
            aValue = new Date(a.requested_at || 0);
            bValue = new Date(b.requested_at || 0);
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredData(result);
  }, [searchTerm, data, sortConfig]);

  async function fetchPendingRequests() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch only pending status
      const response = await fetch(`${API_URL}?status=pending`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }

  function getImageUrl(book) {
    if (!book) return null;
    
    // If there's a picture field with a path
    if (book.picture) {
      // If it's already a full URL, use it
      if (book.picture.startsWith('http')) {
        return book.picture;
      }
      // Otherwise, prepend the base URL
      return `http://localhost:8000${book.picture}`;
    }
    
    // If there's a picture_url field
    if (book.picture_url) {
      return book.picture_url;
    }
    
    return null;
  }

  function handleSort(key) {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  function getSortIndicator(key) {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  }

  function handleView(row) {
    setSelected(row);
    setDueDate("");
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelected(null);
  }

  async function handleApprove() {
    if (!selected) return;
    
    if (!dueDate) {
      setErrorMessage("Please set a due date before approving the request");
      setShowError(true);
      return;
    }

    try {
      // Get librarian_id from sessionStorage
      const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      const librarianId = storedUser.librarian_id;

      const response = await fetch(`${API_URL}${selected.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          due_date: dueDate,
          date_borrowed: new Date().toISOString().split('T')[0], // Today's date
          librarian_id: librarianId, // Include librarian_id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the data
      await fetchPendingRequests();
      
      setShowModal(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error approving request:", err);
      setErrorMessage("Failed to approve request. Please try again.");
      setShowError(true);
    }
  }

  return (
    <LibrarianLayout title="Borrow Requests">
      <div className="requests-page">
        <div className="requests-header">
          <h2>List of Borrow Requests</h2>

          <div className="requests-search">
            <div className="search-wrapper">
              <input 
                className="search-input" 
                placeholder="Search by name, book, email, or student number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-input-icon" aria-label="search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21l-4.35-4.35" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="requests-card">
            <p style={{ padding: '20px', textAlign: 'center' }}>Loading requests...</p>
          </div>
        ) : error ? (
          <div className="requests-card">
            <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
              Error loading data: {error}
            </p>
          </div>
        ) : (
          <div className="requests-card">
            <div className="table-scroll">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID{getSortIndicator('id')}</th>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>NAME{getSortIndicator('name')}</th>
                    <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>EMAIL{getSortIndicator('email')}</th>
                    <th onClick={() => handleSort('book')} style={{ cursor: 'pointer' }}>BORROWED BOOK{getSortIndicator('book')}</th>
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>DATE REQUESTED{getSortIndicator('date')}</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        {searchTerm ? 'No matching requests found' : 'No pending requests'}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.member?.student_number || 'N/A'}</td>
                        <td>{`${row.member?.first_name || ''} ${row.member?.last_name || ''}`}</td>
                        <td>{row.member?.email || 'N/A'}</td>
                        <td>{row.book?.title || 'N/A'}</td>
                        <td>{formatDate(row.requested_at)}</td>

                        <td>
                          <span className="status-pill pending">
                            Pending
                          </span>
                        </td>

                        <td>
                          <button
                            title="view"
                            className="icon-btn"
                            onClick={() => handleView(row)}
                          >
                            <img className="action-icon" src={searchIcon} alt="view" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {showModal && selected && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="borrow-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
              
              <div className="modal-header">
                <div className="modal-icon-circle">?</div>
                <div className="modal-header-content">
                  <h3>Borrow Request</h3>
                  <p className="modal-subtitle">by {selected.member?.student_number}</p>
                </div>
                <div className="modal-status-badge">
                  <span className="status-label">STATUS</span>
                  <span className="status-value status-pending">
                    Pending
                  </span>
                </div>
              </div>

              <div className="modal-body">
                <div className="modal-book-section">
                  <div className="book-cover-container">
                    {getImageUrl(selected.book) ? (
                      <img 
                        src={getImageUrl(selected.book)} 
                        className="book-cover-img" 
                        alt={selected.book?.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="book-cover-placeholder">No Image</div>';
                        }}
                      />
                    ) : (
                      <div className="book-cover-placeholder">No Image</div>
                    )}
                  </div>
                  <h4 className="book-title">{selected.book?.title || 'N/A'}</h4>
                  <p className="book-author">{selected.book?.author || 'N/A'}</p>
                </div>

                <div className="modal-details-section">
                  <div className="detail-row">
                    <span className="detail-label">Borrower Name:</span>
                    <span className="detail-value">
                      {`${selected.member?.first_name || ''} ${selected.member?.last_name || ''}`}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Student Number:</span>
                    <span className="detail-value">{selected.member?.student_number || 'N/A'}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Email Address:</span>
                    <span className="detail-value">{selected.member?.email || 'N/A'}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Book Genre(s):</span>
                    <span className="detail-value">
                      {selected.book?.genre ? selected.book.genre.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Available Copies:</span>
                    <span className="detail-value">{selected.book?.available_copies ?? 'N/A'}</span>
                  </div>

                  <div className="detail-row description-row">
                    <span className="detail-label"></span>
                    <p className="detail-description">{selected.book?.description || 'No description available.'}</p>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Requested Date:</span>
                    <span className="detail-value">{formatDate(selected.requested_at)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Set Due Date:</span>
                    <input
                      type="date"
                      value={dueDate}
                      className="date-input"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDueDate(e.target.value)}
                      placeholder="Select a date"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-primary" onClick={handleApprove}>
                  Approve Request
                </button>
                <button className="btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

          {/* Success Modal */}
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

          {/* Error Modal */}
          {showError && (
            <div className="modal-overlay" onClick={() => setShowError(false)}>
              <div className="error-modal" onClick={(e) => e.stopPropagation()}>
                <div className="error-icon">⚠</div>
                <div className="error-title">Error</div>
                <p className="error-text">{errorMessage}</p>
                <button className="btn-done" onClick={() => setShowError(false)}>
                  OK
                </button>
              </div>
            </div>
          )}
      </div>
    </LibrarianLayout>
  );
}
