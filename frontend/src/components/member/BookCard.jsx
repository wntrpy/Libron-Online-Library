import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

export default function BookCard({ book, onBookmark, onBorrow }) {
  const [isBookmarked, setIsBookmarked] = useState(book.is_bookmarked || false);

  // Sync with prop changes from parent
  useEffect(() => {
    setIsBookmarked(book.is_bookmarked || false);
  }, [book.is_bookmarked]);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const pictureUrl = book.picture_url || book.picture;
  
  // Get user ID from localStorage (already stored during login)
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      console.log('User not logged in');
      return;
    }

    setIsBookmarking(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/book/${book.id}/bookmark/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
        
        // Notify parent component with the new state
        if (onBookmark) {
          onBookmark(book.id, data.bookmarked);
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 w-full max-w-[280px]">
      {/* Book Cover */}
      <div className="bg-gray-100 h-72 flex items-center justify-center relative p-8">
        {pictureUrl ? (
          <img 
            src={pictureUrl} 
            alt={book.title}
            className="h-full w-auto object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">📚</div>
            <p className="text-xs text-gray-500">No cover</p>
          </div>
        )}
        
        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          disabled={isBookmarking}
          className="absolute top-3 right-3 p-1.5 transition-all"
          aria-label="Bookmark"
        >
          <Bookmark 
            className={`w-6 h-6 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors`}
          />
        </button>
      </div>

      {/* Book Info */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-0.5 truncate text-gray-900" title={book.title}>
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 truncate" title={book.author}>
              {book.author}
            </p>
          </div>
        </div>

        {/* Available Copies Badge */}
        <div className="mb-3">
          {book.available_copies > 0 ? (
            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
              Available ({book.available_copies} copies)
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
              No available copy
            </span>
          )}
        </div>

        {/* Borrow Button */}
        <button
          onClick={() => onBorrow && onBorrow(book.id)}
          disabled={book.available_copies === 0}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
            book.available_copies > 0
              ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Borrow
        </button>
      </div>
    </div>
  );
}