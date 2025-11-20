// frontend/src/pages/member/AboutUs.jsx
import React from 'react';
import MemberHeader from '../../components/member/MemberHeader';

export default function AboutUs() {
  return (
    <>
      <MemberHeader />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">About Us</h1>
        <p>This is the About Us page.</p>
      </main>
    </>
  );
}