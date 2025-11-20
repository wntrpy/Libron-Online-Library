// frontend/src/pages/member/MyAccount.jsx
import React from 'react';
import MemberHeader from '../../components/member/MemberHeader';

export default function MyAccount() {
  return (
    <>
      <MemberHeader />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Account</h1>
        <p>This is the My Account page.</p>
      </main>
    </>
  );
}