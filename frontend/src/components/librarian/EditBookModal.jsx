import React, { useState, useEffect } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import BookIcon from "../../assets/librarian/book_icon.png";

const GENRES = [
  "Science Fiction",
  "Romance",
  "Horror",
  "Fantasy"
];

export default function EditBookModal({ book, open, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "Science Fiction",
    available_copies: book.available_copies || 0,
    description: book.description || "",
    picture_url: book.picture_url || "",
    picture: null,
  });
  const [picturePreview, setPicturePreview] = useState(book.picture_url || "");
  const [showDeletePic, setShowDeletePic] = useState(false);

  useEffect(() => {
    setForm({
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "Science Fiction",
      available_copies: book.available_copies || 0,
      description: book.description || "",
      picture_url: book.picture_url || "",
      picture: null,
    });
    setPicturePreview(book.picture_url || "");
    setShowDeletePic(!!book.picture_url);
  }, [book.id, open]);

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
      setShowDeletePic(true);
    }
  };

  const handleDeletePicture = async () => {
    // Call /picture/ endpoint to clear image
    if (book.id) {
      await fetch(`http://localhost:8000/api/book/${book.id}/picture/`, {
        method: "PATCH",
        body: new FormData(),
      });
    }
    setForm((prev) => ({ ...prev, picture: null, picture_url: "" }));
    setPicturePreview(null);
    setShowDeletePic(false);
  };

  const handleSave = () => {
    // Only send changed fields
    const changedFields = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== (book[key] ?? (key === "genre" ? "Science Fiction" : ""))) {
        changedFields[key] = form[key];
      }
    });
    // Always send id for PATCH
    changedFields.id = book.id;
    onSave(changedFields);
  };

  const handleDeleteBook = () => {
    onDelete(book.id);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl relative animate-modal-in">
        <button className="absolute top-4 right-4 text-gray-400 text-3xl hover:text-gray-600 leading-none" onClick={onClose}>&times;</button>
        
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="bg-yellow-500 w-10 h-10 flex items-center justify-center rounded mr-3">
            <img src={BookIcon} alt="Book Icon" className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Book <span className="text-gray-400 font-normal">{book.id.toString().padStart(4, "0")}</span></h2>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Left side - Book Cover */}
          <div className="flex flex-col items-center" style={{ minWidth: 180 }}>
            <img src={picturePreview || "/default-book-cover.png"} alt="Book Cover" className="w-40 h-56 object-cover rounded-lg mb-4 border-2 border-gray-200 shadow-md" />
            {showDeletePic && (
              <button className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow mb-3" onClick={handleDeletePicture}>
                <FaTrash />
              </button>
            )}
            <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold text-sm shadow mb-2">
              Upload File
              <input type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
            </label>
            <div className="text-xs text-gray-600 text-center">File Selected: {form.picture ? form.picture.name : (form.picture_url ? "Current" : "None")}</div>
          </div>

          {/* Right side - Form fields */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Book Title */}
            <div className="flex items-start gap-3">
              <div className="h-6 w-1 bg-yellow-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Book Title</label>
                <input name="title" value={form.title} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
            </div>

            {/* Author */}
            <div className="flex items-start gap-3">
              <div className="h-6 w-1 bg-yellow-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Author(s)</label>
                <input name="author" value={form.author} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
            </div>

            {/* Genre */}
            <div className="flex items-start gap-3">
              <div className="h-6 w-1 bg-yellow-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Genre</label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available Copies */}
            <div className="flex items-start gap-3">
              <div className="h-6 w-1 bg-yellow-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Available Copies</label>
                <input type="number" min={0} name="available_copies" value={form.available_copies} onChange={handleNumberChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <div className="h-6 w-1 bg-yellow-500 rounded flex-shrink-0 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" rows={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8 gap-3">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow" onClick={handleDeleteBook}>
            Delete Book
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
