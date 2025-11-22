import React, { useEffect, useState } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import BookCard from "../../components/librarian/BookCard.jsx";
import BookFilterBar from "../../components/librarian/BookFilterBar.jsx";
import EditBookModal from "../../components/librarian/EditBookModal.jsx";
import Swal from 'sweetalert2';

const API_URL = "http://localhost:8000/api/book/";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Map frontend genre names to backend keys
    const genreMap = {
      "Science Fiction": "science_fiction",
      "Romance": "romance",
      "Horror": "horror",
      "Fantasy": "fantasy"
    };
    const fetchBooks = async () => {
      setLoading(true);
      let params = [];
      if (genre && genreMap[genre]) params.push(`genre=${encodeURIComponent(genreMap[genre])}`);
      const trimmedSearch = search.trim();
      if (trimmedSearch) params.push(`search=${encodeURIComponent(trimmedSearch)}`);
      let url = API_URL + (params.length ? `?${params.join("&")}` : "");
      try {
        const res = await fetch(url);
        const data = await res.json();
        setBooks(data);
      } catch {
        setBooks([]);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [genre, search]);

  const handleEdit = (book) => {
    setEditBook(book);
    setShowEditModal(true);
  };

  const handleDelete = (book) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the book.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteBook(book.id);
      }
    });
  };

  const handleSaveBook = async (form) => {
    // Prepare form data for PATCH (edit)
    const genreMap = {
      "Science Fiction": "science_fiction",
      "Romance": "romance",
      "Horror": "horror",
      "Fantasy": "fantasy"
    };
    const payload = {
      ...form,
      genre: genreMap[form.genre] || form.genre,
    };
    let body;
    let headers = {};
    if (form.picture) {
      // If uploading a new image, use FormData
      body = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        // Only append picture if it's a File
        if (key === "picture" && value instanceof File) {
          body.append(key, value);
        } else if (key !== "picture" && value !== null && value !== undefined) {
          body.append(key, value);
        }
      });
      headers = {};
    } else {
      // Remove picture and picture_url if they're null or empty
      const cleanPayload = { ...payload };
      if (cleanPayload.picture === null || cleanPayload.picture === undefined) delete cleanPayload.picture;
      if (cleanPayload.picture_url === null || cleanPayload.picture_url === undefined) delete cleanPayload.picture_url;
      body = JSON.stringify(cleanPayload);
      headers = { "Content-Type": "application/json" };
    }
    try {
      const res = await fetch(`${API_URL}${editBook.id}/`, {
        method: "PATCH",
        headers,
        body,
      });
      if (!res.ok) throw new Error("Failed to save changes");
      setShowEditModal(false);
      setEditBook(null);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'All changes saved successfully.',
        confirmButtonColor: '#facc15',
      });
      // Re-fetch books immediately
      const genreMap = {
        "Science Fiction": "science_fiction",
        "Romance": "romance",
        "Horror": "horror",
        "Fantasy": "fantasy"
      };
      const fetchBooks = async () => {
        setLoading(true);
        let params = [];
        if (genre && genreMap[genre]) params.push(`genre=${encodeURIComponent(genreMap[genre])}`);
        const trimmedSearch = search.trim();
        if (trimmedSearch) params.push(`search=${encodeURIComponent(trimmedSearch)}`);
        let url = API_URL + (params.length ? `?${params.join("&")}` : "");
        try {
          const res = await fetch(url);
          const data = await res.json();
          setBooks(data);
        } catch {
          setBooks([]);
        }
        setLoading(false);
      };
      fetchBooks();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save changes.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete book");
      // Modal and state handled by SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Book deleted successfully.',
        confirmButtonColor: '#ef4444',
      });
      // Re-fetch books immediately
      const genreMap = {
        "Science Fiction": "science_fiction",
        "Romance": "romance",
        "Horror": "horror",
        "Fantasy": "fantasy"
      };
      const fetchBooks = async () => {
        setLoading(true);
        let params = [];
        if (genre && genreMap[genre]) params.push(`genre=${encodeURIComponent(genreMap[genre])}`);
        const trimmedSearch = search.trim();
        if (trimmedSearch) params.push(`search=${encodeURIComponent(trimmedSearch)}`);
        let url = API_URL + (params.length ? `?${params.join("&")}` : "");
        try {
          const res = await fetch(url);
          const data = await res.json();
          setBooks(data);
        } catch {
          setBooks([]);
        }
        setLoading(false);
      };
      fetchBooks();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete book.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <LibrarianLayout title="Books">
      <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-7 w-2 bg-yellow-500 rounded mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">List of Books</h1>
        </div>
        <div className="flex-1">
          <BookFilterBar genre={genre} setGenre={setGenre} search={search} setSearch={setSearch} />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-8">No books found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map(book => (
            <BookCard key={book.id} book={{ ...book, picture_url: book.cover_image }} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
      <EditBookModal
        book={editBook || {}}
        open={showEditModal}
        onClose={() => { setShowEditModal(false); setEditBook(null); }}
        onSave={handleSaveBook}
        onDelete={(id) => {
          setShowEditModal(false);
          Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the book.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#d1d5db',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              handleDeleteBook(id);
            }
          });
        }}
      />
    </LibrarianLayout>
  );
}
