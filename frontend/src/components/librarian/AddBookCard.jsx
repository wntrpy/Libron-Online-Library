import React from "react";
import { FaPlus } from "react-icons/fa";

export default function AddBookCard({ onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: '12px',
        border: '2px dashed #fbbf24',
        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        cursor: 'pointer',
        minHeight: '370px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(251, 191, 36, 0.3)';
        e.currentTarget.style.borderColor = '#f59e0b';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.15)';
        e.currentTarget.style.borderColor = '#fbbf24';
      }}
    >
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#fbbf24',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
        transition: 'all 0.2s'
      }}>
        <FaPlus style={{ fontSize: '32px', color: '#ffffff' }} />
      </div>
      <h3 style={{ 
        fontWeight: '700', 
        fontSize: '18px', 
        color: '#1f2937',
        margin: 0
      }}>
        Add New Book
      </h3>
      <p style={{ 
        fontSize: '14px', 
        color: '#6b7280',
        marginTop: '8px',
        textAlign: 'center'
      }}>
        Click to add a new book to the library
      </p>
    </div>
  );
}
