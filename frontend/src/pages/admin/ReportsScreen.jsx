import React, { useState, useEffect } from 'react';
import search from '../../assets/admin/search.svg'
import reports from '../../assets/admin/reports.svg'
import download from '../../assets/admin/download.svg'
import filter from '../../assets/admin/filter.svg'

export default function ReportsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch borrow requests from the database
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/borrow-requests/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        setReportData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching reports:', err);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reportData.filter(reportItem => {
    const matchesSearch = 
      reportItem.librarian?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reportItem.member?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reportItem.member?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reportItem.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reportItem.date_borrowed?.includes(searchQuery) || 
      reportItem.returned_at?.includes(searchQuery) ||
      reportItem.due_date?.includes(searchQuery) || 
      reportItem.status?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = !selectedDate || (() => {
      const borrowDate = reportItem.date_borrowed ? new Date(reportItem.date_borrowed) : null;
      const returnDate = reportItem.returned_at ? new Date(reportItem.returned_at) : null;
      const dueDate = reportItem.due_date ? new Date(reportItem.due_date) : null;
      const filterDate = new Date(selectedDate);
      
      return (borrowDate && borrowDate.toDateString() === filterDate.toDateString()) ||
             (returnDate && returnDate.toDateString() === filterDate.toDateString()) ||
             (dueDate && dueDate.toDateString() === filterDate.toDateString());
    })();
    
    return matchesSearch && matchesDate;
  });

  const handleDownloadReport = (format) => {
    if (format === 'PDF') {
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Student Borrowing Report</title>
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
            <h1>Student Borrowing Report</h1>
            <div class="meta">Generated on ${new Date().toLocaleString()}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Librarian</th>
                <th>Student</th>
                <th>Book Title</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Date Returned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReports.map(item => `
                <tr>
                  <td>${item.librarian?.name || 'N/A'}</td>
                  <td>${item.member?.first_name || ''} ${item.member?.last_name || ''}</td>
                  <td>${item.book?.title || 'N/A'}</td>
                  <td>${item.date_borrowed ? new Date(item.date_borrowed).toLocaleDateString() : 'N/A'}</td>
                  <td>${item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}</td>
                  <td>${item.returned_at ? new Date(item.returned_at).toLocaleDateString() : 'N/A'}</td>
                  <td>${item.status_display || item.status || 'N/A'}</td>
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
      const headers = ['Librarian', 'Student', 'Book Title', 'Date Borrowed', 'Due Date', 'Date Returned', 'Status'];
      const rows = filteredReports.map(item => [
        item.librarian?.name || 'N/A',
        `${item.member?.first_name || ''} ${item.member?.last_name || ''}`.trim(),
        item.book?.title || 'N/A',
        item.date_borrowed ? new Date(item.date_borrowed).toLocaleDateString() : 'N/A',
        item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A',
        item.returned_at ? new Date(item.returned_at).toLocaleDateString() : 'N/A',
        item.status_display || item.status || 'N/A'
      ]);
      
      const content = '\uFEFF' + [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'student_borrowing_report.csv';
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
        Loading borrowing reports...
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
        @-webkit-keyframes fadeInRow {
          from {
            opacity: 0;
            -webkit-transform: translateY(10px);
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            -webkit-transform: translateY(0);
            transform: translateY(0);
          }
        }
        @keyframes fadeInRow {
          from {
            opacity: 0;
            -webkit-transform: translateY(10px);
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            -webkit-transform: translateY(0);
            transform: translateY(0);
          }
        }
        
        .report-row {
          -webkit-animation: fadeInRow 0.3s ease-out forwards !important;
          animation: fadeInRow 0.3s ease-out forwards !important;
        }
        
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
              <img src={reports} alt="Reports Logo"/>
            </span>
            <h1 style={{ 
              fontFamily: 'Alexandria,sans-serif',
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#000000',
              margin: 0 
            }}>
              Student Borrowing Report
            </h1>
          </div>

          {/* Search Bar */}
          <div style={{position: "relative", width: "63vh"}}>
            <img src={search} alt="Search Icon" style={{height: '28px', position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)'}}/>
            <input
              type="text"
              placeholder="Search any details ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
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
                          <img src={reports} alt="Reports Logo"/>
                        </span>
                        <h1 style={{ 
                          fontFamily: 'Alexandria,sans-serif',
                          fontSize: '30px', 
                          fontWeight: 'bold', 
                          color: '#000000',
                          margin: 0 
                        }}>
                          Student Borrowing Report
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
                      border: '1px solid #f3f4f6',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease'
                    }}>
                      {/* Table Header */}
                      <div style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr 2fr',
                        padding: '16px 30px',
                        fontWeight: '700',
                        fontSize: '13px',
                        fontFamily: 'Alexandria,sans-serif',
                        color: '#1f2937',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                      }}>
                        <div>LIBRARIAN</div>
                        <div>STUDENT</div>
                        <div>BOOK TITLE</div>
                        <div>DATE BORROWED</div>
                        <div>DUE DATE</div>
                        <div>DATE RETURNED</div>
                        <div>STATUS</div>
                      </div>

                      {/* Table Body */}
                      {filteredReports.length === 0 ? (
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
                        filteredReports.map((reportItem, index) => (
                          <div
                            key={reportItem.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr 2fr',
                              padding: '16px 30px',
                              borderBottom: index !== filteredReports.length - 1 ? '1px solid #f3f4f6' : 'none',
                              alignItems: 'center',
                              fontSize: '14px',
                              animation: 'fadeInRow 0.3s ease-out forwards',
                              animationDelay: `${index * 0.05}s`,
                              opacity: 0,
                              fontFamily: 'Alexandria,sans-serif',
                              backgroundColor: '#ffffff',
                              transition: 'all 0.2s ease',
                              cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fef3c7';
                              e.currentTarget.style.transform = 'scale(1.002)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          > 
                            <div style={{ color: '#374151', fontWeight: '500', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.librarian?.name || 'N/A'}
                            </div>
                            <div style={{ color: '#374151', fontWeight: '500', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.member?.first_name || ''} {reportItem.member?.last_name || ''}
                            </div>
                            <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.book?.title || 'N/A'}
                            </div>
                            <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.date_borrowed ? new Date(reportItem.date_borrowed).toLocaleDateString() : 'N/A'}
                            </div>
                            <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.due_date ? new Date(reportItem.due_date).toLocaleDateString() : 'N/A'}
                            </div>
                            <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.returned_at ? new Date(reportItem.returned_at).toLocaleDateString() : 'N/A'}
                            </div>  
                            <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                              {reportItem.status_display || reportItem.status || 'N/A'}
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
          border: '1px solid #f3f4f6',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease'
        }}>
          {/* Table Header */}
          <div style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr 2fr',
            padding: '16px 30px',
            fontWeight: '700',
            fontSize: '13px',
            fontFamily: 'Alexandria,sans-serif',
            color: '#1f2937',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div>LIBRARIAN</div>
            <div>STUDENT</div>
            <div>BOOK TITLE</div>
            <div>DATE BORROWED</div>
            <div>DUE DATE</div>
            <div>DATE RETURNED</div>
            <div>STATUS</div>
          </div>

          {/* Table Body */}
          {filteredReports.length === 0 ? (
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
            filteredReports.map((reportItem, index) => (
              <div
                key={reportItem.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr 2fr',
                  padding: '16px 30px',
                  borderBottom: index !== filteredReports.length - 1 ? '1px solid #f3f4f6' : 'none',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontFamily: 'Alexandria,sans-serif',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.transform = 'scale(1.002)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              > 
                <div style={{ color: '#374151', fontWeight: '500', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.librarian?.name || 'N/A'}
                </div>
                <div style={{ color: '#374151', fontWeight: '500', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.member?.first_name || ''} {reportItem.member?.last_name || ''}
                </div>
                <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.book?.title || 'N/A'}
                </div>
                <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.date_borrowed ? new Date(reportItem.date_borrowed).toLocaleDateString() : 'N/A'}
                </div>
                <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.due_date ? new Date(reportItem.due_date).toLocaleDateString() : 'N/A'}
                </div>
                <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.returned_at ? new Date(reportItem.returned_at).toLocaleDateString() : 'N/A'}
                </div>  
                <div style={{ color: '#000000', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                  {reportItem.status_display || reportItem.status || 'N/A'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}