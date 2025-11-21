import React, { useState, useEffect } from 'react';
import { X, Bookmark } from 'lucide-react';

export default function BookDetailsModal({
  book,
  isOpen,
  onClose,
  onBookmark,
  onBorrow,
  isBorrowing = false,
}) {
  const [isBookmarked, setIsBookmarked] = useState(book?.is_bookmarked || false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    setIsBookmarked(book?.is_bookmarked || false);
  }, [book?.is_bookmarked]);

  if (!isOpen || !book) return null;

  const pictureUrl = book.picture_url || book.picture;
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

  const getGenreDisplay = (genre) => {
    const genreMap = {
      science_fiction: 'Science Fiction',
      fantasy: 'Fantasy',
      horror: 'Horror',
      romance: 'Romance',
      fiction: 'Fiction',
      mystery: 'Mystery',
      biography: 'Biography',
      history: 'History'
    };
    return genreMap[genre] || genre;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-32">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition z-10"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left: Book Cover */}
              <div className="md:col-span-1">
                <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center relative p-4">
                  {pictureUrl ? (
                    <img
                      src={pictureUrl}
                      alt={book.title}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-2">📚</div>
                      <p className="text-xs text-gray-500">No cover</p>
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={handleBookmarkClick}
                    disabled={isBookmarking}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                  >
                    <Bookmark
                      className={`w-6 h-6 ${
                        isBookmarked
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      } transition-colors`}
                    />
                  </button>
                </div>
              </div>

              {/* Right: Book Details */}
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  by <span className="font-semibold">{book.author}</span>
                </p>

                {/* Genre Badge */}
                {book.genre && (
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {getGenreDisplay(book.genre)}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description || 'No description available for this book.'}
                  </p>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Availability
                  </h2>
                  {book.available_copies > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">
                        <span className="font-semibold">{book.available_copies}</span> copies available
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="text-gray-700">Currently unavailable</span>
                    </div>
                  )}
                </div>

                {/* Total Copies */}
                {book.total_copies && (
                  <div className="mb-8">
                    <p className="text-sm text-gray-600">
                      Total copies in library: <span className="font-semibold">{book.total_copies}</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onBorrow && onBorrow(book);
                      onClose();
                    }}
                    disabled={book.available_copies === 0 || isBorrowing}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      book.available_copies > 0 && !isBorrowing
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {book.available_copies === 0
                      ? 'Not Available'
                      : isBorrowing
                      ? 'Sending request...'
                      : 'Borrow This Book'}
                  </button>

                  <button
                    onClick={onClose}
                    className="py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
