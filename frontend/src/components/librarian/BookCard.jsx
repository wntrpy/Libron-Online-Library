import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f3f4f6',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'all 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(251, 191, 36, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
    }}>
      <div style={{
        width: '140px',
        height: '200px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px',
        background: '#f3f4f6'
      }}>
        <img
          src={book.picture_url || "/default-book-cover.png"}
          alt={book.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</p>
        {book.available_copies > 0 ? (
          <span style={{
            display: 'inline-block',
            background: '#d1fae5',
            color: '#059669',
            fontSize: '12px',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '16px',
            border: '1.5px solid #a7f3d0',
            marginBottom: '12px'
          }}>
            Available ({book.available_copies})
          </span>
        ) : (
          <span style={{
            display: 'inline-block',
            background: '#fee2e2',
            color: '#dc2626',
            fontSize: '12px',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '16px',
            border: '1.5px solid #fecaca',
            marginBottom: '12px'
          }}>
            Unavailable
          </span>
        )}
      </div>
      <div style={{ display: 'flex', width: '100%', gap: '8px', marginTop: '8px' }}>
        <button
          style={{
            flex: 1,
            background: '#fbbf24',
            color: '#1f2937',
            fontWeight: '600',
            fontSize: '14px',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 6px rgba(251, 191, 36, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f59e0b';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(251, 191, 36, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fbbf24';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(251, 191, 36, 0.3)';
          }}
          onClick={() => onEdit(book)}
        >
          <FaEdit style={{ fontSize: '14px' }} /> Edit
        </button>
        <button
          style={{
            background: '#fee2e2',
            color: '#dc2626',
            fontWeight: '600',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '44px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fecaca';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          title="Delete Book"
          onClick={() => onDelete(book)}
        >
          <FaTrash style={{ fontSize: '16px' }} />
        </button>
      </div>
    </div>
  );
}
