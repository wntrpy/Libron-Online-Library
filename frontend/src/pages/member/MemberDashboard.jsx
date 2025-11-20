// frontend/src/pages/member/MemberDashboard.jsx
import React from 'react';
import MemberHeader from '../../components/member/MemberHeader';

export default function Dashboard() {
  return (
    <>
      <MemberHeader />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </main>
    </>
  );
}
