import React from 'react';
import { Bookmark } from 'lucide-react';

export default function BookCard({ book, onBookmark, onBorrow }) {
  const pictureUrl = book.picture_url || book.picture;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-xs hover:shadow-2xl transition-shadow duration-300">
      {/* Book Cover */}
      <div className="bg-gray-200 aspect-[3/4] flex items-center justify-center relative overflow-hidden">
        {pictureUrl ? (
          <img 
            src={pictureUrl} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-2">📚</div>
            <p className="text-sm text-gray-500">No cover</p>
          </div>
        )}
        
        {/* Bookmark Button */}
        <button
          onClick={() => onBookmark && onBookmark(book.id)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label="Bookmark"
        >
          <Bookmark 
            className={`w-6 h-6 ${book.is_bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} transition-colors`}
          />
        </button>
      </div>

      {/* Book Info */}
      <div className="p-5 bg-white">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-1" title={book.author}>
          {book.author}
        </p>

        {/* Available Copies Badge */}
        <div className="mb-4">
          {book.available_copies > 0 ? (
            <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
              Available ({book.available_copies} copies)
            </span>
          ) : (
            <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500">
              No available copy
            </span>
          )}
        </div>

        {/* Borrow Button */}
        <button
          onClick={() => onBorrow && onBorrow(book.id)}
          disabled={book.available_copies === 0}
          className={`w-full py-3 px-4 rounded-lg font-bold text-base transition-all ${
            book.available_copies > 0
              ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 active:scale-95 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Borrow
        </button>
      </div>
    </div>
  );
}