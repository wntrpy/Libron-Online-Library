import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/admin/logo.svg'
import student from '../../assets/admin/student.svg'
import librarian from '../../assets/admin/librarian.svg'
import book from '../../assets/admin/book.svg'
import user from '../../assets/admin/user.svg'
import studAcclogo from '../../assets/admin/studAcclogo.svg'
import search from '../../assets/admin/search.svg'
import filter from '../../assets/admin/filter.svg'
import deleteIcon from '../../assets/admin/delete.svg'
import logoutlogo from '../../assets/admin/logoutlogo.svg'
import LibrarianAccountScreen from './LibrarianAccountScreen.jsx'
import ReportsScreen from './ReportsScreen.jsx'
import BookLogsScreen from './BookLogsScreen.jsx'

export default function StudentManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [currentPage, setCurrentPage] = useState('students');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToReset, setStudentToReset] = useState(null);
  
  // Reset Password Form State
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    showNewPassword: false,
    showConfirmPassword: false
  });

  // Fetch students from the database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/members/members/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched students:', data);
        setStudents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching students:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentPage === 'students') {
      fetchStudents();
    }
  }, [currentPage]);

  const colleges = ['ALL', ...new Set(students.map(s => s.college).filter(Boolean))];

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      student.student_number?.toString().includes(searchQuery) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.college?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCollege = selectedCollege === 'ALL' || student.college === selectedCollege;
    
    return matchesSearch && matchesCollege;
  });

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const handleResetPasswordClick = (student) => {
    setStudentToReset(student);
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetPassword = async () => {
    // Validation
    if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }

    if (resetPasswordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/members/members/${studentToReset.id}/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: resetPasswordData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successfully!');
        setShowResetPasswordModal(false);
        setStudentToReset(null);
        setResetPasswordData({
          newPassword: '',
          confirmPassword: '',
          showNewPassword: false,
          showConfirmPassword: false
        });
      } else {
        const errorMessage = data.error || data.detail || data.message || 'Failed to reset password';
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleDelete = (studentId, studentNo, studentName) => {
    setStudentToDelete({ id: studentId, number: studentNo, name: studentName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/members/members/${studentToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok || response.status === 204) {
        setStudents(students.filter(s => s.id !== studentToDelete.id));
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } else {
        alert('Failed to delete student');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Error deleting student');
    }
  };

  const MenuItem = ({ icon, label, page, isActive, onClick }) => (
    <div
      onClick={onClick || (() => setCurrentPage(page))}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        color: '#ffffffff',
        backgroundColor: isActive ? '#F9B530' : 'transparent',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        fontFamily: 'Alexandria,sans-serif',
        fontSize: '16px',
        padding: '14px 20px',
        fontWeight: isActive ? '700' : '700',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isActive ? '0 2px 8px rgba(16, 15, 15, 1)' : '0 2px 8px rgba(0, 0, 0, 0)',
        transform: 'translateX(0)'
      }}
      onMouseOver={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateX(5px)';
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
    >
      {!isActive && (
        <div style={{
          content: '',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '0',
          background: 'rgba(255, 255, 255, 0.1)',
          transition: 'width 0.3s ease',
          zIndex: 0
        }}></div>
      )}
      <span style={{ fontSize: '20px', zIndex: 1, position: 'relative' }}>{icon}</span>
      <span style={{ zIndex: 1, position: 'relative', letterSpacing: '0.3px' }}>{label}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .student-row {
          animation: fadeInRow 0.3s ease-out forwards !important;
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        
        .modal-content {
          animation: slideIn 0.3s ease-out;
        }
        
        select option {
          font-family: 'Alexandria', sans-serif !important;
          font-size: 15px !important;
          padding: 12px 16px !important;
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        
        select option:hover {
          background-color: #fef3c7 !important;
        }
        
        select option:checked {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
      `}</style>
      
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {/* Sidebar */}
      <div style={{
        width: '350px',
        backgroundColor: '#111826',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '2px solid #444444'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            marginBottom: '12px'
          }}>
            <img src={logo} alt="Logo"/>
          </div>
          <h1 style={{
            fontFamily: 'Alexandria,sans-serif',
            fontSize: '32px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Libron <span style={{ color: '#FACC15' }}>Admin</span>
          </h1>
        </div>

        {/* Management Section */}
        <div>
          <div style={{
            fontFamily: 'Alexandria,sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            color: '#ffffffff',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            paddingLeft: '20px'
          }}>
            User Management
          </div>
          <MenuItem 
            icon={<img src={student} alt="Student Icon" style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
            }}/>}
            label="Student Accounts" 
            page="students"
            isActive={currentPage === 'students'}
          />
          <MenuItem 
            icon={<img src={librarian} alt="Librarian Icon" style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
            }}/>}
            label="Librarian Accounts" 
            page="librarians"
            isActive={currentPage === 'librarians'}
          />
        </div>

        {/* Reports Section */}
        <div>
          <div style={{
            fontFamily: 'Alexandria,sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            color: '#ffffffff',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            paddingLeft: '20px'
          }}>
            Reports
          </div>
          <MenuItem 
            icon={<img src={user} alt="User Icon" style={{
              width: '30px',
              height: '30px',
              objectFit: 'contain',
            }}/>} 
            label="User Borrow Reports" 
            page="reports"
            isActive={currentPage === 'reports'}
          />
          <MenuItem 
            icon={<img src={book} alt="Book Icon" style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
            }}/>}
            label="Book Inventory Logs" 
            page="inventory"
            isActive={currentPage === 'inventory'}
          />
        </div>

        {/* Logout Section */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid #444444' }}>
          <MenuItem 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffffff" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            }
            label="Log Out" 
            onClick={() => setShowLogoutModal(true)}
            isActive={false}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: '40px',
        overflowY: 'auto'
      }}>
        {/* Student Management Page */}
        {currentPage === 'students' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '30px',
            padding: '40px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header with Search and Filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flex: '0 0 auto'
              }}>
                <span style={{ fontSize: '32px', marginTop: '13px' }}>
                  <img src={studAcclogo} alt="Student Account Logo"/>
                </span>
                <h1 style={{ 
                  fontFamily: 'Alexandria,sans-serif',
                  fontSize: '30px', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  margin: 0 
                }}>
                  Student Management
                </h1>
              </div>

              {/* Search Bar */}
              <div style={{position: "relative", width: "78vh"}}>
                <img src={search} alt="Search Icon" style={{height: '28px', position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)'}}/>
                <input
                  type="text"
                  placeholder="Search a student ..."
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

              {/* Filter Dropdown */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '17px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffffff',
                minHeight: '55px',
                width: '190px'
              }}>
               <img src={filter} alt="Filter Icon" style={{marginTop:'5px',height: '28px'}}/>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '15px',
                    fontFamily: 'Alexandria,sans-serif',
                    fontWeight: '400',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    color: '#000000',
                    padding: '0',
                    width: '135px'
                  }}
                >
                  {colleges.map(college => (
                    <option 
                      key={college} 
                      value={college}
                      style={{
                        fontFamily: 'Alexandria,sans-serif',
                        fontSize: '15px',
                        padding: '10px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      College ({college})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading/Error States */}
            {loading ? (
              <div style={{
                padding: '60px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '15px',
                fontFamily: 'Alexandria,sans-serif'
              }}>
                Loading students...
              </div>
            ) : error ? (
              <div style={{
                padding: '60px',
                textAlign: 'center',
                color: '#ef4444',
                fontSize: '15px',
                fontFamily: 'Alexandria,sans-serif'
              }}>
                Error loading students: {error}
              </div>
            ) : (
              /* Table Container */
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
                  gridTemplateColumns: '1.2fr 2fr 2fr 2fr 2fr',
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
                  <div>STUDENT NO.</div>
                  <div>NAME</div>
                  <div>COLLEGE</div>
                  <div>EMAIL</div>
                  <div>ACTION</div>
                </div>

                {/* Table Body */}
                {filteredStudents.length === 0 ? (
                  <div style={{
                    padding: '60px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '15px',
                    fontFamily: 'Alexandria,sans-serif'
                  }}>
                    No students found
                  </div>
                ) : (
                  filteredStudents.map((student, index) => (
                    <div
                      key={student.id}
                      style={{display: 'grid',
                        gridTemplateColumns: '1.2fr 2fr 2fr 2fr 2fr',
                        padding: '16px 30px',
                        borderBottom: index !== filteredStudents.length - 1 ? '1px solid #f3f4f6' : 'none',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontFamily: 'Alexandria,sans-serif',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.2s ease',
                        cursor: 'default',
                        animation: 'fadeInRow 0.3s ease-out forwards',
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0
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
                        {student.student_number || 'N/A'}
                      </div>
                      <div style={{ color: '#374151', fontWeight: '500', fontFamily: 'Alexandria,sans-serif' }}>
                        {student.first_name || ''} {student.last_name || ''}
                      </div>
                      <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                        {student.college || 'N/A'}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'Alexandria,sans-serif' }}>
                        {student.email || 'N/A'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleResetPasswordClick(student)}
                          style={{
                            backgroundColor: '#1f2937',
                            color: '#ffffff',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Alexandria,sans-serif',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(31, 41, 55, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#111827';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(31, 41, 55, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#1f2937';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(31, 41, 55, 0.2)';
                          }}
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.student_number, `${student.first_name} ${student.last_name}`)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontFamily: 'Alexandria,sans-serif',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        
        {currentPage === 'librarians' && (<LibrarianAccountScreen />)}
        {currentPage === 'reports' && (<ReportsScreen />)}
        {currentPage === 'inventory' && (<BookLogsScreen />)}

  
        {/* Reset Password Modal */}
        {showResetPasswordModal && studentToReset && (
          <div 
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
            <div 
              className="modal-content"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '50px',
                width: '550px',
                maxWidth: '90%',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}>
              {/* Icon */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '25px'
              }}>
                <div style={{
                  backgroundColor: '#FCD34D',
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div style={{
                    display: 'flex',
                    gap: '6px'
                  }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%'
                      }}/>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif',
                textAlign: 'center',
                marginBottom: '10px',
                margin: 0
              }}>
                Reset Password
              </h2>

              {/* Subtitle */}
              <p style={{
                fontSize: '16px',
                color: '#9CA3AF',
                fontFamily: 'Alexandria,sans-serif',
                textAlign: 'center',
                marginBottom: '35px'
              }}>
                Reset password for: {studentToReset.first_name} {studentToReset.last_name}
              </p>

              {/* New Password Field */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#000000',
                  fontFamily: 'Alexandria,sans-serif'
                }}>
                  New Password:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={resetPasswordData.showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={resetPasswordData.newPassword}
                    onChange={handleResetPasswordInputChange}
                    placeholder="Enter New Password"
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '15px 50px 15px 20px',
                      fontSize: '15px',
                      border: '2px solid #D1D5DB',
                      borderRadius: '12px',
                      fontFamily: 'Alexandria,sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#6B7280'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setResetPasswordData(prev => ({
                      ...prev,
                      showNewPassword: !prev.showNewPassword
                    }))}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      {resetPasswordData.showNewPassword ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      ) : (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div style={{ marginBottom: '35px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#000000',
                  fontFamily: 'Alexandria,sans-serif'
                }}>
                  Confirm New Password:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={resetPasswordData.showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={resetPasswordData.confirmPassword}
                    onChange={handleResetPasswordInputChange}
                    placeholder="Enter New Password"
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      padding: '15px 50px 15px 20px',
                      fontSize: '15px',
                      border: '2px solid #D1D5DB',
                      borderRadius: '12px',
                      fontFamily: 'Alexandria,sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#6B7280'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setResetPasswordData(prev => ({
                      ...prev,
                      showConfirmPassword: !prev.showConfirmPassword
                    }))}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      {resetPasswordData.showConfirmPassword ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      ) : (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <button
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setStudentToReset(null);
                    setResetPasswordData({
                      newPassword: '',
                      confirmPassword: '',
                      showNewPassword: false,
                      showConfirmPassword: false
                    });
                  }}
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#ffffff',
                    padding: '14px 35px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Alexandria,sans-serif',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  style={{
                    backgroundColor: '#FCD34D',
                    color: '#ffffffff',
                    padding: '14px 35px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Alexandria,sans-serif',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e5a52d'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#F9B530'}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div 
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
            <div 
              className="modal-content"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '48px',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}>
              {/* Trash Icon */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
               <img src={deleteIcon} alt="Delete Icon" />
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: 'Alexandria, sans-serif',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#EF4444',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                Are you sure you want to<br />delete this account?
              </h2>

              {/* Subtitle */}
              <p style={{
                fontFamily: 'Alexandria, sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                color: '#6B7280',
                margin: '0 0 32px 0'
              }}>
                This action is permanent and cannot be undone.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setStudentToDelete(null);
                  }}
                  style={{
                    fontFamily: 'Alexandria, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    backgroundColor: '#4B5563',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#4B5563'}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    fontFamily: 'Alexandria, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    backgroundColor: '#EF4444',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
       {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              {/* Info Icon */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <div style={{
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={logoutlogo} alt="Info Icon" style={{height:'80px'}}/>
                </div>
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: 'Alexandria, sans-serif',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                INFO
              </h2>

              {/* Subtitle */}
              <p style={{
                fontFamily: 'Alexandria, sans-serif',
                fontSize: '20px',
                fontWeight: '500',
                color: '#6B7280',
                margin: '0 0 32px 0'
              }}>
                Are you sure you<br />want to Log out?
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleLogout}
                  style={{
                    fontFamily: 'Alexandria, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#000000',
                    backgroundColor: '#FCD34D',
                    padding: '12px 40px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FDE047'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#FCD34D'}
                >
                  CONFIRM
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    fontFamily: 'Alexandria, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    backgroundColor: '#6B7280',
                    padding: '12px 40px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4B5563'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6B7280'}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    </>
  );
}