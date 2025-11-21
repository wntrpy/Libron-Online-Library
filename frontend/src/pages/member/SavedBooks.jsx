import React, { useState, useEffect } from 'react';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';
import BookCard from '../../components/member/BookCard';
import BorrowConfirmModal from '../../components/member/BorrowConfirmModal';
import { Search } from 'lucide-react';

export default function SavedBooks() {
  const [savedBooks, setSavedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBorrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowingId, setBorrowingId] = useState(null);
  const [borrowFeedback, setBorrowFeedback] = useState(null);

  // Get user ID from localStorage (already stored during login)
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;
  const memberId = storedUser?.member_id;

  useEffect(() => {
    if (userId) {
      fetchSavedBooks();
    } else {
      setError('User not logged in');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSavedBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/book/my_bookmarks/?user_id=${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Extract books from bookmarks
        const books = data.map(bookmark => ({
          ...bookmark.book,
          is_bookmarked: true,
          bookmark_id: bookmark.id
        }));
        setSavedBooks(books);
        setFilteredBooks(books);
      } else {
        setError('Failed to fetch saved books');
      }
    } catch (err) {
      console.error('Error fetching saved books:', err);
      setError('Error loading saved books');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (bookId, isBookmarked) => {
    // If unbookmarked, remove from saved list
    if (!isBookmarked) {
      const updatedBooks = savedBooks.filter(book => book.id !== bookId);
      setSavedBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
    }
  };

  const handleBorrowClick = (book) => {
    if (!userId || !memberId) {
      setBorrowFeedback({
        type: 'error',
        message: 'Please sign in as a member to borrow books.',
      });
      return;
    }

    if (!book?.id) {
      setBorrowFeedback({
        type: 'error',
        message: 'Unable to identify this book.',
      });
      return;
    }

    if (book.available_copies === 0) {
      setBorrowFeedback({
        type: 'error',
        message: 'This book is currently unavailable.',
      });
      return;
    }

    setSelectedBook(book);
    setBorrowModalOpen(true);
  };

  const closeBorrowModal = () => {
    setBorrowModalOpen(false);
    setSelectedBook(null);
  };

  const handleBorrowConfirm = async () => {
    if (!selectedBook || !memberId) return;

    try {
      setBorrowingId(selectedBook.id);

      const response = await fetch('http://localhost:8000/api/borrow-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: selectedBook.id,
          member_id: memberId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.detail || 'Failed to send borrow request.';
        throw new Error(message);
      }

      setBorrowFeedback({
        type: 'success',
        message: 'Borrow request sent! Check the Pending tab to track it.',
      });
    } catch (err) {
      setBorrowFeedback({
        type: 'error',
        message: err.message || 'Something went wrong while borrowing this book.',
      });
    } finally {
      setBorrowingId(null);
      closeBorrowModal();
    }
  };

  useEffect(() => {
    if (!borrowFeedback) return undefined;

    const timeout = setTimeout(() => setBorrowFeedback(null), 4000);
    return () => clearTimeout(timeout);
  }, [borrowFeedback]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredBooks(savedBooks);
    } else {
      const queryLower = query.toLowerCase();
      const filtered = savedBooks.filter(book =>
        book.title.toLowerCase().includes(queryLower) ||
        book.author.toLowerCase().includes(queryLower)
      );
      setFilteredBooks(filtered);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'white', paddingTop: '80px' }}>
      <MemberHeader />

      <main style={{ flex: '1', maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
        {/* Header with Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            Saved Books
          </h1>

          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              placeholder="Search by Title or Author..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '0.5rem 2.5rem 0.5rem 1rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
          </div>
        </div>

        {borrowFeedback && (
          <div
            style={{
              marginBottom: '1.5rem',
              borderRadius: '1rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor:
                borrowFeedback.type === 'success' ? '#ecfccb' : '#fee2e2',
              color: borrowFeedback.type === 'success' ? '#3f6212' : '#b91c1c',
              border:
                borrowFeedback.type === 'success'
                  ? '1px solid #d9f99d'
                  : '1px solid #fecaca',
            }}
          >
            <span style={{ fontWeight: 600 }}>{borrowFeedback.message}</span>
            <button
              onClick={() => setBorrowFeedback(null)}
              style={{
                marginLeft: '1rem',
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1.25rem',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ backgroundColor: '#F3F4F6', borderRadius: '0.5rem', height: '400px' }}></div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#EF4444', fontSize: '1.125rem' }}>{error}</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Showing {filteredBooks.length} saved book{filteredBooks.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBookmark={handleBookmark}
                  onBorrow={handleBorrowClick}
                  isBorrowing={borrowingId === book.id}
                />
              ))}
            </div>
          </>
        ) : (
          //padding bottom para ndi masagwa ung sa footer
          <div style={{ textAlign: 'center', padding: '6rem 0 15rem 0' }}>
            <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
              {searchQuery ? 'No books match your search' : 'You haven\'t saved any books yet'}
            </p>
          </div>
        )}
      </main>
      <MemberFooter />

      <BorrowConfirmModal
        isOpen={isBorrowModalOpen}
        book={selectedBook}
        isSubmitting={borrowingId === selectedBook?.id}
        onConfirm={handleBorrowConfirm}
        onCancel={closeBorrowModal}
      />
    </div>
  );
}