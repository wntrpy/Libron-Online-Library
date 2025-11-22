import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="book-card bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.10)] border border-gray-200 p-4 flex flex-col items-center transition hover:shadow-lg" style={{ minWidth: 220 }}>
      <img
        src={book.picture_url || "/default-book-cover.png"}
        alt={book.title}
        className="w-32 h-48 object-cover mb-3 rounded"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      />
      <div className="text-center w-full">
        <h3 className="font-bold text-lg mb-1 text-black truncate">{book.title}</h3>
        <p className="text-base text-gray-700 mb-2 font-medium truncate">{book.author}</p>
        {book.available_copies > 0 ? (
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Available ({book.available_copies} copies)
          </span>
        ) : (
          <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            No available copy
          </span>
        )}
      </div>
      <div className="flex w-full justify-between items-center mt-3 px-2">
        <button
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 text-base shadow transition-all duration-150"
          style={{ minWidth: 0 }}
          onClick={() => onEdit(book)}
        >
          <FaEdit className="text-lg" /> Edit Book
        </button>
        <button
          className="ml-2 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full flex items-center justify-center shadow transition-all duration-150"
          title="Delete Book"
          onClick={() => onDelete(book)}
        >
          <FaTrash className="text-xl" />
        </button>
      </div>
    </div>
  );
}
