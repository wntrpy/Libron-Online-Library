import React from "react";
import "../../styles/LibrarianLayout.css";
import Sidebar from "../../components/librarian/Sidebar.jsx";
import Header from "../../components/librarian/Header.jsx";

export default function LibrarianLayout({ children, title }) {
  return (
    <div className="librarian-layout">
      <div className="librarian-layout-body">
        <Sidebar />

        <div className="librarian-main">
          <Header />

          <main className="librarian-content">
            {title && <h1 className="page-title">{title}</h1>}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
