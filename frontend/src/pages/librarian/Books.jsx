import React, { useEffect, useState } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import BookCard from "../../components/librarian/BookCard.jsx";
import AddBookCard from "../../components/librarian/AddBookCard.jsx";
import BookFilterBar from "../../components/librarian/BookFilterBar.jsx";
import EditBookModal from "../../components/librarian/EditBookModal.jsx";
import AddBookModal from "../../components/librarian/AddBookModal.jsx";
import Swal from 'sweetalert2';

const API_URL = "http://localhost:8000/api/book/";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleAddBook = async (form) => {
    // Prepare form data for POST (add new book)
    const genreMap = {
      "Science Fiction": "science_fiction",
      "Romance": "romance",
      "Horror": "horror",
      "Fantasy": "fantasy"
    };
    
    const body = new FormData();
    body.append("title", form.title);
    body.append("author", form.author);
    body.append("genre", genreMap[form.genre] || form.genre);
    body.append("available_copies", form.available_copies);
    body.append("description", form.description);
    if (form.picture) {
      body.append("picture", form.picture);
    }
    
    // Get librarian_id from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.id) {
      body.append("librarian_id", user.id);
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error("Failed to add book");
      
      setShowAddModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Book added successfully.',
        confirmButtonColor: '#facc15',
      });
      
      // Re-fetch books immediately
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
        text: 'Failed to add book.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <LibrarianLayout title="Books">
      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#2e2e2e', margin: 0 }}>List of Books</h1>
          <div style={{ flex: 1, maxWidth: '600px', marginLeft: '40px' }}>
            <BookFilterBar genre={genre} setGenre={setGenre} search={search} setSearch={setSearch} />
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '15px' }}>Loading books...</div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '15px' }}>No books found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {books.map(book => (
              <BookCard key={book.id} book={{ ...book, picture_url: book.cover_image }} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            <AddBookCard onClick={() => setShowAddModal(true)} />
          </div>
        )}
      </div>
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
      <AddBookModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddBook}
      />
    </LibrarianLayout>
  );
}
