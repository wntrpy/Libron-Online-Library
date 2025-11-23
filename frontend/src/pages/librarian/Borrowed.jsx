import React, { useState, useEffect } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import "../../styles/Borrowed.css";
import searchIcon from "../../assets/librarian/searchicon.png";

const API_URL = "http://localhost:8000/api/borrow-requests/";

export default function Borrowed() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch borrowed books on component mount
  useEffect(() => {
    fetchBorrowedBooks();
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
        
        return (
          memberName.includes(searchLower) ||
          bookTitle.includes(searchLower) ||
          studentNumber.includes(searchLower)
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
          case 'book':
            aValue = a.book?.title || '';
            bValue = b.book?.title || '';
            break;
          case 'dateBorrowed':
            aValue = new Date(a.date_borrowed || 0);
            bValue = new Date(b.date_borrowed || 0);
            break;
          case 'dueDate':
            aValue = new Date(a.due_date || 0);
            bValue = new Date(b.due_date || 0);
            break;
          case 'dateReturned':
            aValue = new Date(a.returned_at || 0);
            bValue = new Date(b.returned_at || 0);
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
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

  async function fetchBorrowedBooks() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch approved, overdue, and returned status
      const response = await fetch(`${API_URL}?status=approved,overdue,returned`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleView(row) {
    setSelected(row);
    setReturnDate("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelected(null);
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

  async function handleMarkReturned() {
    if (!returnDate) {
      alert("Please select a return date");
      return;
    }

    try {
      // Get librarian_id from sessionStorage
      const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      const librarianId = storedUser.librarian_id;

      // Create a datetime string in ISO format without timezone conversion
      // The returnDate is in format YYYY-MM-DD from the date input
      const returnDateTimeISO = `${returnDate}T12:00:00.000Z`;
      
      console.log('Selected return date:', returnDate);
      console.log('Sending to backend:', returnDateTimeISO);
      
      const response = await fetch(`${API_URL}${selected.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'returned',
          returned_at: returnDateTimeISO,
          librarian_id: librarianId, // Include librarian_id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the data
      await fetchBorrowedBooks();
      
      setShowModal(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error marking as returned:", err);
      alert("Failed to mark book as returned. Please try again.");
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

  return (
    <LibrarianLayout title="Borrowed Books">
      <div className="requests-page">
        <div className="requests-header">
          <div className="requests-title">
            <h2>List of Borrowed Books</h2>
          </div>

          <div className="requests-search">
            <div className="search-wrapper">
              <input 
                className="search-input" 
                placeholder="Search by name, book, or student number" 
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
            <p style={{ padding: '20px', textAlign: 'center' }}>Loading borrowed books...</p>
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
                    <th onClick={() => handleSort('book')} style={{ cursor: 'pointer' }}>BORROWED BOOK{getSortIndicator('book')}</th>
                    <th onClick={() => handleSort('dateBorrowed')} style={{ cursor: 'pointer' }}>DATE BORROWED{getSortIndicator('dateBorrowed')}</th>
                    <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>DUE DATE{getSortIndicator('dueDate')}</th>
                    <th onClick={() => handleSort('dateReturned')} style={{ cursor: 'pointer' }}>DATE RETURNED{getSortIndicator('dateReturned')}</th>
                    <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>STATUS{getSortIndicator('status')}</th>
                    <th></th>
                  </tr>
                </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                      {searchTerm ? 'No matching records found' : 'No borrowed books found'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr 
                      key={row.id}
                      style={{
                        animation: `fadeInRow 0.3s ease-out forwards`,
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0
                      }}
                    >
                      <td>{row.member?.student_number || 'N/A'}</td>
                      <td>{`${row.member?.first_name || ''} ${row.member?.last_name || ''}`}</td>
                      <td>{row.book?.title || 'N/A'}</td>
                      <td>{formatDate(row.date_borrowed)}</td>
                      <td>{formatDate(row.due_date)}</td>
                      <td>{formatDate(row.returned_at)}</td>
                      <td>
                        <span className={`status-pill ${
                          row.status === 'approved' ? 'approved' : 
                          row.status === 'overdue' ? 'rejected' : 
                          row.status === 'returned' ? 'returned' : 
                          'pending'
                        }`}>
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button title="view" className="icon-btn" onClick={() => handleView(row)}>
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

        {/* Modal for a borrowed item */}
        {showModal && selected && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="borrow-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
              
              <div className="modal-header">
                <div className="modal-icon-circle">?</div>
                <div className="modal-header-content">
                  <h3>Borrowed Book</h3>
                  <p className="modal-subtitle">by {selected.member?.student_number}</p>
                </div>
                <div className="modal-status-badge">
                  <span className="status-label">STATUS</span>
                  <span className={`status-value ${
                    selected.status === 'approved' ? 'status-approved' : 
                    selected.status === 'overdue' ? 'status-overdue' : 
                    selected.status === 'returned' ? 'status-returned' : 
                    'status-pending'
                  }`}>
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="modal-body">
                <div className="modal-book-section">
                  <div className="book-cover-container">
                    {selected.book?.picture || selected.book?.picture_url ? (
                      <img 
                        src={selected.book.picture || selected.book.picture_url} 
                        className="book-cover-img" 
                        alt={selected.book?.title}
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
                    <span className="detail-label">Borrowed Date:</span>
                    <span className="detail-value">{formatDate(selected.date_borrowed)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Due Date:</span>
                    <span className="detail-value">{formatDate(selected.due_date)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Return Date:</span>
                    {selected.status === 'approved' ? (
                      <input
                        type="date"
                        value={returnDate}
                        className="date-input"
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={selected.date_borrowed}
                        placeholder="Select a date"
                      />
                    ) : (
                      <span className="detail-value">{formatDate(selected.returned_at)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {selected.status === 'approved' && (
                  <button className="btn-primary" onClick={handleMarkReturned}>
                    Mark as Returned
                  </button>
                )}
                <button className="btn-secondary" onClick={closeModal}>
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
