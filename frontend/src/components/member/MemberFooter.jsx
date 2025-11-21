// frontend/src/components/member/MemberFooter.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MemberFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest uppercase mb-3 text-gray-400">Online</p>
          <h2 className="text-5xl font-bold mb-12">
            <span className="text-yellow-400">Libron Library.</span> 
          </h2>
          
          <div className="flex justify-center gap-8 mb-12">
            <button
              onClick={() => navigate('/member/dashboard')}
              className="text-gray-400 hover:text-yellow-400 transition font-medium"
            >
              E-Catalog
            </button>
            <button
              onClick={() => navigate('/member/about-us')}
              className="text-gray-400 hover:text-yellow-400 transition font-medium"
            >
              About Us
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>2025 Libron . All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
