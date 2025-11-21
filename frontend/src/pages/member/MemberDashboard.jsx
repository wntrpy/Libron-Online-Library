import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MemberHeader from '../../components/member/MemberHeader';
import BookCard from '../../components/member/BookCard';

export default function MemberDashboard() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/book/popular/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Books data:', data);
        setPopularBooks(data);
      } else {
        console.error('Failed to fetch popular books');
      }
    } catch (error) {
      console.error('Error fetching popular books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (bookId) => {
    setPopularBooks(books => 
      books.map(book => 
        book.id === bookId 
          ? { ...book, is_bookmarked: !book.is_bookmarked }
          : book
      )
    );
  };

  const handleBorrow = (bookId) => {
    console.log('Borrow book:', bookId);
  };

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: '80px' }}>
      <MemberHeader />
      
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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
              onKeyPress={handleKeyPress}
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
                onBorrow={handleBorrow}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No books available</p>
          </div>
        )}
      </main>
    </div>
  );
}