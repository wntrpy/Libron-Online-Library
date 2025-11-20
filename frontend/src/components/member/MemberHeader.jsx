import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MemberHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT MENU */}
          <div className="flex items-center space-x-10">
            <button
              onClick={() => navigate("/member/dashboard")}
              className={`font-medium text-lg transition-colors ${
                isActive("/member/dashboard")
                  ? "text-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              }`}
            >
              E-Catalog
            </button>

            <button
              onClick={() => navigate("/member/saved-books")}
              className={`font-medium text-lg transition-colors ${
                isActive("/member/saved-books")
                  ? "text-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              }`}
            >
              Saved Books
            </button>
          </div>

          {/* CENTER LOGO */}
          <div className="flex items-center">
            <img
              src="/src/assets/app_icon.png"
              alt="Libron Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* RIGHT MENU */}
          <div className="flex items-center space-x-10">
            <button
              onClick={() => navigate("/member/borrows")}
              className={`font-medium text-lg transition-colors ${
                isActive("/member/borrows")
                  ? "text-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              }`}
            >
              Borrows
            </button>

            <button
              onClick={() => navigate("/member/about-us")}
              className={`font-medium text-lg transition-colors ${
                isActive("/member/about-us")
                  ? "text-yellow-500"
                  : "text-gray-700 hover:text-yellow-500"
              }`}
            >
              About Us
            </button>

            {/* YELLOW BUTTON */}
            <button
              onClick={() => navigate("/member/my-account")}
              className="bg-yellow-400 hover:bg-yellow-500 shadow-md text-gray-900 font-semibold px-6 py-2 rounded-full transition-colors"
            >
              My Account
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
