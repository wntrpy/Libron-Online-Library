import React, { useState, useEffect } from 'react';
import search from '../../assets/admin/search.svg'
import bookLogo from '../../assets/admin/bookLogo.svg'
import download from '../../assets/admin/download.svg'
import filter from '../../assets/admin/filter.svg'
import "@fontsource/alexandria/900.css";

export default function BookLogsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from the database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        const response = await fetch("http://localhost:8000/api/borrow-requests/", {  //SHOULD BE FROM BOOK ENTITY
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
        
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data); // Debug log
        setInventoryData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching books:', err);
        // Set empty array so component still renders
        setInventoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = 
      item.book?.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.book?.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.book?.available_copies?.toString().includes(searchQuery) ||
      item.librarian?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(item.book?.created_at || item.requested_at).toLocaleDateString().includes(searchQuery);
    
    // Date filter
    const matchesDate = !selectedDate || (() => {
      const itemDate = new Date(item.book?.created_at || item.requested_at);
      const filterDate = new Date(selectedDate);
      return itemDate.toDateString() === filterDate.toDateString();
    })();
    
    return matchesSearch && matchesDate;
  });

  const handleDownloadReport = (format) => {
    if (format === 'PDF') {
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Book Inventory Logs</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px;
              margin: 0;
              background: #fff;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #fbbf24;
              padding-bottom: 20px;
            }
            h1 { 
              color: #000; 
              font-size: 28px;
              margin: 0;
            }
            .meta {
              color: #666;
              font-size: 14px;
              margin-top: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            th { 
              background-color: #fbbf24; 
              padding: 15px; 
              text-align: left; 
              font-weight: bold;
              border: 1px solid #000000ff;
              font-size: 14px;
            }
            td { 
              padding: 12px 15px; 
              border: 1px solid #000000ff;
              font-size: 13px;
            }
            tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Book Inventory Logs</h1>
            <div class="meta">Generated on ${new Date().toLocaleString()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Available Copies</th>
                <th>Added By</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              ${filteredInventory.map(item => `
                <tr>
                  <td>${item.book?.id || 'N/A'}</td>
                  <td>${item.book?.title || 'N/A'}</td>
                  <td>${item.book?.author || 'N/A'}</td>
                  <td>${item.book?.available_copies || 0}</td>
                  <td>${item.librarian?.name || 'N/A'}</td>
                  <td>${new Date(item.book?.created_at || item.requested_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      return;
    }

    // Handle Excel format
    if (format === 'Excel') {
      const headers = ['Book ID', 'Book Title', 'Author', 'Available Copies', 'Added By', 'Date Added'];
      const rows = filteredInventory.map(item => [
        item.book?.id || 'N/A',
        item.book?.title || 'N/A',
        item.book?.author || 'N/A',
        item.book?.available_copies || 0,
        item.librarian?.name || 'N/A',
        new Date(item.book?.created_at || item.requested_at).toLocaleDateString()
      ]);
      
      const content = '\uFEFF' + [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'book_inventory_logs.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '30px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontSize: '18px',
        fontFamily: 'Alexandria,sans-serif',
        color: '#6b7280'
      }}>
        Loading book inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '30px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontSize: '18px',
        fontFamily: 'Alexandria,sans-serif',
        color: '#ef4444'
      }}>
        Error loading data: {error}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
      
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '30px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* Header with Search and Filters */}
        <div 
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: '0 0 auto'
          }}>
            <span style={{ fontSize: '32px', marginTop: '13px' }}>
              <img src={bookLogo} alt="Inventory Account Logo"/>
            </span>
            <h1 style={{ 
              fontFamily: 'Alexandria,sans-serif',
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#000000',
              margin: 0 
            }}>
              Book Inventory Logs
            </h1>
          </div>

          {/* Search Bar */}
          <div style={{position: "relative", width: "70vh"}}>
            <img src={search} alt="Search Icon" style={{height: '28px', position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)'}}/>
            <input
              type="text"
              placeholder="Search any details ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif',
                padding: "14px 20px 14px",
                fontWeight: '400',
                fontSize: '15px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* Date Filter Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 15px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            minHeight: '55px',
            minWidth: '190px'
          }}>
            <span style={{ fontSize: '20px' }}>
              <img src={filter} alt="Filter Icon" style={{marginTop:'5px',height: '38px'}}/>
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '18px',
                cursor: 'pointer',
                outline: 'none',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif',
                width: '100%'
              }}
            />
          </div>
          
          {/* Download Reports Button */}
          <div style={{ position: 'relative' }}>
            <img 
              src={download} 
              alt="Download Icon" 
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              style={{
                height:'40px',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
            
            {/* Download Modal */}
            {showDownloadOptions && (
              <>
                {/* Backdrop */}
                <div 
                  onClick={() => setShowDownloadOptions(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Modal Content */}
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="no-print"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      padding: '40px',
                      width: '90%',
                      maxWidth: '1200px',
                      maxHeight: '90vh',
                      overflow: 'auto',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {/* Modal Header with Download Options */}
                    <div 
                      className="no-print"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '30px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ fontSize: '32px', marginTop: '13px' }}>
                          <img src={bookLogo} alt="Inventory Account Logo"/>
                        </span>
                        <h1 style={{ 
                          fontFamily: 'Alexandria,sans-serif',
                          fontSize: '30px', 
                          fontWeight: 'bold', 
                          color: '#000000',
                          margin: 0 
                        }}>
                          Book Inventory Logs
                        </h1>
                      </div>

                      {/* Download Buttons on Top */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        {['PDF', 'Excel'].map((format) => (
                          <button
                            key={format}
                            onClick={() => handleDownloadReport(format)}
                            style={{
                              fontFamily: 'Alexandria,sans-serif',
                              fontSize: '15px',
                              fontWeight: '500',
                              color: '#000000',
                              padding: '12px 24px',
                              cursor: 'pointer',
                              border: '1px solid #d1d5db',
                              borderRadius: '12px',
                              backgroundColor: '#ffffff',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#fbbf24';
                              e.target.style.borderColor = '#fbbf24';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#ffffff';
                              e.target.style.borderColor = '#d1d5db';
                            }}
                          >
                            Download as {format}
                          </button>
                        ))}
                        <button
                          onClick={() => setShowDownloadOptions(false)}
                          style={{
                            fontFamily: 'Alexandria,sans-serif',
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#ffffff',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            border: 'none',
                            borderRadius: '12px',
                            backgroundColor: '#ef4444',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#ef4444';
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    {/* Table Container */}
                    <div style={{
                      border: '1px solid #7c7979ff',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff'
                    }}>
                      {/* Table Header */}
                      <div style={{
                        backgroundColor: '#fbbf24',
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 2fr 1.5fr 2fr 2fr',
                        padding: '18px 30px',
                        fontWeight: '500',
                        fontSize: '16px',
                        fontFamily: 'Alexandria,sans-serif',
                        color: '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        <div>BOOK ID</div>
                        <div>BOOK TITLE</div>
                        <div>AUTHOR</div>
                        <div>AVAILABLE</div>
                        <div>ADDED BY</div>
                        <div>DATE ADDED</div>
                      </div>

                      {/* Table Body */}
                      {filteredInventory.length === 0 ? (
                        <div style={{
                          padding: '60px',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontSize: '15px',
                          fontFamily: 'Alexandria,sans-serif'
                        }}>
                          No reports found
                        </div>
                      ) : (
                        filteredInventory.map((item, index) => (
                          <div
                            key={item.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 2fr 2fr 1.5fr 2fr 2fr',
                              padding: '20px 30px',
                              borderBottom: index !== filteredInventory.length - 1 ? '1px solid #e5e7eb' : 'none',
                              alignItems: 'center',
                              fontSize: '16px',
                              fontFamily: 'Alexandria,sans-serif',
                              backgroundColor: '#ffffff'
                            }}
                          > 
                            <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {item.book?.id || 'N/A'}
                            </div>
                            <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {item.book?.title || 'N/A'}
                            </div>
                            <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {item.book?.author || 'N/A'}
                            </div>
                            <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {item.book?.available_copies || 0}
                            </div>
                            <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {item.librarian?.name || 'N/A'}
                            </div>
                            <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {new Date(item.book?.created_at || item.requested_at).toLocaleDateString()}
                            </div>  
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div style={{
          border: '1px solid #7c7979ff',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}>
          {/* Table Header */}
          <div style={{
            backgroundColor: '#fbbf24',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 2fr 1.5fr 2fr 2fr',
            padding: '18px 30px',
            fontWeight: '500',
            fontSize: '16px',
            fontFamily: 'Alexandria,sans-serif',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>BOOK ID</div>
            <div>BOOK TITLE</div>
            <div>AUTHOR</div>
            <div>AVAILABLE</div>
            <div>ADDED BY</div>
            <div>DATE ADDED</div>
          </div>

          {/* Table Body */}
          {filteredInventory.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '15px',
              fontFamily: 'Alexandria,sans-serif'
            }}>
              No reports found
            </div>
          ) : (
            filteredInventory.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 2fr 1.5fr 2fr 2fr',
                  padding: '20px 30px',
                  borderBottom: index !== filteredInventory.length - 1 ? '1px solid #e5e7eb' : 'none',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontFamily: 'Alexandria,sans-serif',
                  backgroundColor: '#ffffff'
                }}
              > 
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {item.book?.id || 'N/A'}
                </div>
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {item.book?.title || 'N/A'}
                </div>
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {item.book?.author || 'N/A'}
                </div>
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {item.book?.available_copies || 0}
                </div>
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {item.librarian?.name || 'N/A'}
                </div>
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {new Date(item.book?.created_at || item.requested_at).toLocaleDateString()}
                </div>  
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}