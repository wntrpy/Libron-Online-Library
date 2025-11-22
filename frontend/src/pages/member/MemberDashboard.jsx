import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';
import BookCard from '../../components/member/BookCard';
import BorrowConfirmModal from '../../components/member/BorrowConfirmModal';

export default function MemberDashboard() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [borrowingId, setBorrowingId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBorrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowFeedback, setBorrowFeedback] = useState(null);

  // Get user ID from localStorage
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const userId = storedUser?.id;
  const memberId = storedUser?.member_id;

  const genres = [
    { key: 'science_fiction', display: 'Science Fiction' },
    { key: 'fantasy', display: 'Fantasy' },
    { key: 'horror', display: 'Horror' },
    { key: 'romance', display: 'Romance' }
  ];

  useEffect(() => {
    if (userId) {
      fetchBookmarkedIds();
      fetchPopularBooks();
      fetchBooksByGenres();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchBookmarkedIds = async () => {
    try {
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
        // Store bookmarked book IDs
        const bookmarkedIds = data.map(bookmark => bookmark.book.id);
        localStorage.setItem('bookmarkedIds', JSON.stringify(bookmarkedIds));
      }
    } catch (error) {
      console.error('Error fetching bookmarked IDs:', error);
    }
  };

  const fetchPopularBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/book/popular/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedIds')) || [];
        const booksWithBookmarkStatus = data.map(book => ({
          ...book,
          is_bookmarked: bookmarkedIds.includes(book.id)
        }));
        console.log('Books data:', booksWithBookmarkStatus);
        setPopularBooks(booksWithBookmarkStatus);
      } else {
        console.error('Failed to fetch popular books');
      }
    } catch (error) {
      console.error('Error fetching popular books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByGenres = async () => {
    try {
      const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedIds')) || [];
      const genreData = {};
      for (const genre of genres) {
        const response = await fetch(`http://localhost:8000/api/book/?genre=${encodeURIComponent(genre.key)}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Filter the response to only include books with matching genre
          const filteredBooks = Array.isArray(data)
            ? data.filter(book => book.genre && book.genre === genre.key)
            : data.results ? data.results.filter(book => book.genre && book.genre === genre.key)
              : [];
          // Add bookmark status
          genreData[genre.key] = filteredBooks.map(book => ({
            ...book,
            is_bookmarked: bookmarkedIds.includes(book.id)
          }));
        }
      }
      setBooksByGenre(genreData);
    } catch (error) {
      console.error('Error fetching books by genre:', error);
    }
  };

  const handleBookmark = (bookId, isBookmarked) => {
    // Update localStorage
    const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedIds')) || [];
    if (isBookmarked) {
      if (!bookmarkedIds.includes(bookId)) {
        bookmarkedIds.push(bookId);
      }
    } else {
      const index = bookmarkedIds.indexOf(bookId);
      if (index > -1) {
        bookmarkedIds.splice(index, 1);
      }
    }
    localStorage.setItem('bookmarkedIds', JSON.stringify(bookmarkedIds));

    // Update popular books
    setPopularBooks(books =>
      books.map(book =>
        book.id === bookId ? { ...book, is_bookmarked: isBookmarked } : book
      )
    );

    // Update books by genre
    setBooksByGenre(genreData => {
      const updated = { ...genreData };
      Object.keys(updated).forEach(genre => {
        updated[genre] = updated[genre].map(book =>
          book.id === bookId ? { ...book, is_bookmarked: isBookmarked } : book
        );
      });
      return updated;
    });
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
        const errorMessage = errorData?.non_field_errors?.[0] ||
          errorData?.detail ||
          'Failed to send borrow request. Please try again.';
        throw new Error(errorMessage);
      }

      setBorrowFeedback({
        type: 'success',
        message: 'Borrow request sent! Check the Pending tab to track it.',
      });
    } catch (error) {
      const errorMessage = error.message.includes('maximum limit of 5 active borrows')
        ? 'You have reached the maximum limit of 5 active/pending borrows. Please return some books before borrowing more.'
        : error.message || 'Failed to process your borrow request. Please try again.';

      setBorrowFeedback({
        type: 'error',
        message: errorMessage,
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

  const getFilteredBooks = () => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const allBooks = [popularBooks, ...Object.values(booksByGenre).flat()];

    // Remove duplicates and filter by search query
    const uniqueBooks = {};
    allBooks.flat().forEach(book => {
      if (!uniqueBooks[book.id]) {
        uniqueBooks[book.id] = book;
      }
    });

    return Object.values(uniqueBooks).filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  };

  const searchResults = getFilteredBooks();
  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: '80px' }}>
      <MemberHeader />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            Popular Titles Right Now
          </h1>

          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              placeholder="Search by Title or Author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Show Search Results or Regular Content */}
        {showSearchResults ? (
          // Search Results View
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} style={{ backgroundColor: '#F3F4F6', borderRadius: '0.5rem', height: '400px' }}></div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Found {searchResults.length} book{searchResults.length !== 1 ? 's' : ''}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                  {searchResults.map((book) => (
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
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No books match your search</p>
              </div>
            )}
          </div>
        ) : (
          // Regular View
          <>
            {/* Books Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} style={{ backgroundColor: '#F3F4F6', borderRadius: '0.5rem', height: '400px' }}></div>
                ))}
              </div>
            ) : popularBooks.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {popularBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBookmark={handleBookmark}
                    onBorrow={handleBorrowClick}
                    isBorrowing={borrowingId === book.id}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No books available</p>
              </div>
            )}

            {/* Genre Sections */}
            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '3px solid #FBBF24' }}>
                List of Books
              </h2>

              {genres.map((genre) => (
                <div key={genre.key}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem', marginTop: '2rem' }}>
                    {genre.display}
                  </h3>
                  {booksByGenre[genre.key] && booksByGenre[genre.key].length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                      {booksByGenre[genre.key].map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          onBookmark={handleBookmark}
                          onBorrow={handleBorrowClick}
                          isBorrowing={borrowingId === book.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '2rem' }}>No books in this genre</p>
                  )}
                </div>
              ))}
            </div>
          </>
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