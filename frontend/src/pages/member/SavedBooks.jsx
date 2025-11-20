// frontend/src/pages/member/SavedBooks.jsx
import React from 'react';
import MemberHeader from '../../components/member/MemberHeader';

export default function SavedBooks() {
  return (
    <>
      <MemberHeader />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Saved Books</h1>
        <p>This is the Saved Books page.</p>
      </main>
    </>
  );
}