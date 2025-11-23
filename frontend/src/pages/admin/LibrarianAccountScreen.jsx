import React, { useState, useEffect } from 'react';
import search from '../../assets/admin/search.svg'
import add from '../../assets/admin/add.svg'
import libAcc from '../../assets/admin/libAcc.svg'
import deleteIcon from '../../assets/admin/delete.svg'

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function LibrarianAccountsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    password: ''
  });

  // Reset password form state - UPDATED to match StudentManagement
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    showNewPassword: false,
    showConfirmPassword: false
  });

  // Fetch librarians on component mount
  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/librarians/`);
      if (response.ok) {
        const data = await response.json();
        setLibrarians(data);
      } else {
        console.error('Failed to fetch librarians');
      }
    } catch (error) {
      console.error('Error fetching librarians:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAccount = async () => {
    if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/librarians/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          contact_number: formData.contactNumber,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const newLibrarian = await response.json();
        setLibrarians([...librarians, newLibrarian]);
        setShowAddModal(false);
        setFormData({ fullName: '', email: '', contactNumber: '', password: '' });
        setShowPassword(false);
        alert('Librarian account created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to create librarian: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error creating librarian:', error);
      alert('Error creating librarian account. Please try again.');
    }
  };

  const handleDeleteClick = (librarian) => {
    setSelectedLibrarian(librarian);
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/librarians/${selectedLibrarian.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLibrarians(librarians.filter(lib => lib.id !== selectedLibrarian.id));
        setShowDeleteModal(false);
        setSelectedLibrarian(null);
        alert('Librarian account deleted successfully!');
      } else {
        alert('Failed to delete librarian account');
      }
    } catch (error) {
      console.error('Error deleting librarian:', error);
      alert('Error deleting librarian account. Please try again.');
    }
  };

  const handleResetPasswordClick = (librarian) => {
    setSelectedLibrarian(librarian);
    setShowResetPasswordModal(true);
  };

  const handleResetPassword = async () => {
    // Validation - UPDATED to match StudentManagement
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
      const response = await fetch(`${API_BASE_URL}/librarians/${selectedLibrarian.id}/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: resetPasswordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successfully!');
        setShowResetPasswordModal(false);
        setSelectedLibrarian(null);
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

  const filteredLibrarians = librarians.filter(librarian => {
    const searchLower = searchQuery.toLowerCase();
    return (
      librarian.name?.toLowerCase().includes(searchLower) ||
      librarian.email?.toLowerCase().includes(searchLower) ||
      librarian.contact_number?.toString().includes(searchQuery) || 
      librarian.id?.toString().includes(searchQuery) ||
      librarian.librarian_id?.toLowerCase().includes(searchLower)
    );
  });

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
        
        .librarian-row {
          animation: fadeInRow 0.3s ease-out forwards !important;
        }
        
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        
        .modal-content {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '30px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
      {/* Header with Search and Add Button */}
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
            <img src={libAcc} alt="Librarian Account Logo"/>
          </span>
          <h1 style={{ 
            fontFamily: 'Alexandria,sans-serif',
            fontSize: '30px', 
            fontWeight: 'bold', 
            color: '#000000',
            margin: 0 
          }}>
            Librarian Management
          </h1>
        </div>

        {/* Search Bar */}
        <div style={{position: "relative", width: "80vh"}}>
          <img src={search} alt="Search Icon" style={{height: '28px', position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)'}}/>
          <input
            type="text"
            placeholder="Search a librarian ..."
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

        {/* Add Librarian Button */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: '#F9B530',
            color: '#ffffffff',
            padding: '10px 26px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Alexandria,sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#F9B530'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fbbf24'}
        >
          <img src={add} alt="ADD LIBRARIAN" style={{height:'35px'}}/>
          Add Librarian
        </button>
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
          gridTemplateColumns: '1fr 2fr 2.5fr 2fr 2fr',
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
          <div>ID</div>
          <div>NAME</div>
          <div>EMAIL</div>
          <div>CONTACT</div>
          <div>ACTION</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '15px',
            fontFamily: 'Alexandria,sans-serif'
          }}>
            Loading...
          </div>
        ) : filteredLibrarians.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '15px',
            fontFamily: 'Alexandria,sans-serif'
          }}>
            No librarians found
          </div>
        ) : (
          filteredLibrarians.map((librarian, index) => (
            <div
              key={librarian.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 2.5fr 2fr 2fr',
                padding: '16px 30px',
                borderBottom: index !== filteredLibrarians.length - 1 ? '1px solid #f3f4f6' : 'none',
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
                {librarian.librarian_id || librarian.id}
              </div>
              <div style={{ color: '#374151', fontWeight: '500', fontFamily: 'Alexandria,sans-serif' }}>
                {librarian.name}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'Alexandria,sans-serif' }}>
                {librarian.email}
              </div>
              <div style={{ color: '#374151', fontWeight: '400', fontFamily: 'Alexandria,sans-serif' }}>
                {librarian.contact_number || librarian.contactNumber}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleResetPasswordClick(librarian)}
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
                    whiteSpace: 'nowrap',
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
                  onClick={() => handleDeleteClick(librarian)}
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

      {/* Add Librarian Modal */}
      {showAddModal && (
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              setFormData({ fullName: '', email: '', contactNumber: '', password: '' });
              setShowPassword(false);
            }
          }}
        >
          <div 
            className="modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
            padding: '40px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{
                backgroundColor: '#F9B530',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif',
                margin: 0
              }}>
                Add Librarian
              </h2>
            </div>

            {/* Form Fields */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif'
              }}>
                Full Name:
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontFamily: 'Alexandria,sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif'
              }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontFamily: 'Alexandria,sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif'
              }}>
                Contact Number:
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter contact number"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontFamily: 'Alexandria,sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000',
                fontFamily: 'Alexandria,sans-serif'
              }}>
                Password:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (minimum 8 characters)"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '45px',
                    fontSize: '15px',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    fontFamily: 'Alexandria,sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ fullName: '', email: '', contactNumber: '', password: '' });
                  setShowPassword(false);
                }}
                style={{
                  backgroundColor: '#4b5563',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Alexandria,sans-serif',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4b5563'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                style={{
                  backgroundColor: '#F9B530',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Alexandria,sans-serif',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5a52d'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#F9B530'}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal - UPDATED TO MATCH STUDENTMANAGEMENT */}
      {showResetPasswordModal && selectedLibrarian && (
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
              Reset password for: {selectedLibrarian.name}
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
                  setSelectedLibrarian(null);
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
      {showDeleteModal && selectedLibrarian && (
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setSelectedLibrarian(null);
            }
          }}
        >
          <div 
            className="modal-content"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}>
            {/* Trash Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <img src={deleteIcon} alt="Delete Icon"/>
            </div>

            {/* Warning Text */}
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ef4444',
              fontFamily: 'Alexandria,sans-serif',
              margin: '0 0 16px 0',
              lineHeight: '1.2'
            }}>
              Are you sure you want to delete this account?
            </h2>
            
            <p style={{
              fontFamily: 'Alexandria, sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              color: '#6B7280',
              margin: '0 0 32px 0'
            }}>
              This action is permanent and cannot be undone.
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLibrarian(null);
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
                onMouseOut={(e) => e.target.style.backgroundColor = '#4b5563'}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
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
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}