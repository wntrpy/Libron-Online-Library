import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import BookIcon from "../../assets/librarian/book_icon.png";

const GENRES = [
  "Science Fiction",
  "Romance",
  "Horror",
  "Fantasy"
];

export default function AddBookModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "Science Fiction",
    available_copies: 0,
    description: "",
    picture: null,
  });
  const [picturePreview, setPicturePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    setForm((prev) => ({ ...prev, available_copies: Number(e.target.value) }));
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, picture: file }));
      setPicturePreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = () => {
    onAdd(form);
    // Reset form
    setForm({
      title: "",
      author: "",
      genre: "Science Fiction",
      available_copies: 0,
      description: "",
      picture: null,
    });
    setPicturePreview(null);
  };

  const handleCancel = () => {
    // Reset form
    setForm({
      title: "",
      author: "",
      genre: "Science Fiction",
      available_copies: 0,
      description: "",
      picture: null,
    });
    setPicturePreview(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease',
      overflowY: 'auto'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }
            60% {
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
      <div style={{
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        animation: 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        overflow: 'hidden'
      }}>
        {/* Close button */}
        <button
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            border: 'none',
            background: '#f3f4f6',
            color: '#6b7280',
            fontSize: '24px',
            fontWeight: '300',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb';
            e.currentTarget.style.color = '#374151';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
          onClick={handleCancel}
        >
          ×
        </button>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px 28px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fbbf24',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '700',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
          }}>
            <img src={BookIcon} alt="Book" style={{ width: '28px', height: '28px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1f2937' }}>
              Add New Book
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Fill in the book details below
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{
          display: 'flex',
          gap: '28px',
          padding: '28px',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* Left side - Book Cover */}
          <div style={{
            width: '200px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '280px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <img
                src={picturePreview || "/default-book-cover.png"}
                alt="Book Cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <label style={{
              width: '100%',
              background: '#d1fae5',
              color: '#059669',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              textAlign: 'center',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a7f3d0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#d1fae5';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <FaUpload /> Upload Cover
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePictureUpload} />
            </label>
          </div>

          {/* Right side - Form */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Book Title */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Book Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Author */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Author <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Genre and Available Copies */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Genre <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    background: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Available Copies <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="available_copies"
                  value={form.available_copies}
                  onChange={handleNumberChange}
                  min="0"
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '20px 28px',
          borderTop: '1px solid #e5e7eb',
          background: '#fafafa'
        }}>
          <button
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              border: '1.5px solid #d1d5db',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              background: '#fbbf24',
              color: '#1f2937',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fbbf24';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.3)';
            }}
            onClick={handleAdd}
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}
