import React, { useState, useEffect } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import "../../styles/Reports.css";
import downloadIcon from "../../assets/librarian/downloadIcon.png";
import searchIcon from "../../assets/librarian/searchicon.png";

const API_URL = "http://localhost:8000/api/borrow-requests/";

export default function Reports() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));
  const [librarianName] = useState(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    return storedUser.name || 'Librarian';
  });

  // Fetch all borrow requests on component mount
  useEffect(() => {
    fetchAllBorrowRequests();
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
          case 'librarian':
            aValue = a.librarian?.librarian_id || '';
            bValue = b.librarian?.librarian_id || '';
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

  async function fetchAllBorrowRequests() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all borrow requests regardless of status
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error("Error fetching borrow requests:", err);
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

  function handlePrint() {
    window.print();
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

  return (
    <LibrarianLayout title="Generate Reports">
      <div className="requests-page">
        <div className="print-metadata">
          <div className="print-meta-row">
            <span>Date Printed: {currentDate}</span>
            <span>Printed by: {librarianName}</span>
          </div>
        </div>
        
        <div className="requests-header reports-header">
          <div className="requests-title">
            <h2>Libron Library - Borrow Transactions Report</h2>
          </div>
          <div className="requests-search">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, book, or student number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-input-icon">
                <img src={searchIcon} alt="search" style={{ width: 18, height: 18 }} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="requests-card">
            <p style={{ padding: '20px', textAlign: 'center' }}>Loading transactions...</p>
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
              <table className="requests-table reports-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID{getSortIndicator('id')}</th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>NAME{getSortIndicator('name')}</th>
                  <th onClick={() => handleSort('book')} style={{ cursor: 'pointer' }}>BORROWED BOOK{getSortIndicator('book')}</th>
                  <th onClick={() => handleSort('dateBorrowed')} style={{ cursor: 'pointer' }}>DATE<br/>BORROWED{getSortIndicator('dateBorrowed')}</th>
                  <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>DUE DATE{getSortIndicator('dueDate')}</th>
                  <th onClick={() => handleSort('dateReturned')} style={{ cursor: 'pointer' }}>DATE<br/>RETURNED{getSortIndicator('dateReturned')}</th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>STATUS{getSortIndicator('status')}</th>
                  <th onClick={() => handleSort('librarian')} style={{ cursor: 'pointer' }}>LIBRARIAN ID{getSortIndicator('librarian')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "24px 0" }}>
                      {searchTerm ? "No transactions match your search." : "No borrow transactions found."}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((r, index) => (
                    <tr 
                      key={r.id}
                      style={{
                        animation: `fadeInRow 0.3s ease-out forwards`,
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0
                      }}
                    >
                      <td>{r.member?.student_number || 'N/A'}</td>
                      <td>{`${r.member?.first_name || ''} ${r.member?.last_name || ''}`}</td>
                      <td>{r.book?.title || 'N/A'}</td>
                      <td>{formatDate(r.date_borrowed)}</td>
                      <td>{formatDate(r.due_date)}</td>
                      <td>{formatDate(r.returned_at)}</td>
                      <td>
                        <span className={`status-pill ${
                          r.status === 'approved' ? 'approved' : 
                          r.status === 'overdue' ? 'rejected' : 
                          r.status === 'returned' ? 'returned' : 
                          'pending'
                        }`}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td>{r.librarian?.librarian_id || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="reports-print">
          <button className="print-btn" onClick={handlePrint}>
            <img src={downloadIcon} alt="download" style={{ width: 16, height: 16 }} />
            Print
          </button>
        </div>
      </div>
    </LibrarianLayout>
  );
}
