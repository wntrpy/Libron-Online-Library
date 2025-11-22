import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import "../../styles/LibrarianLayout.css";

export default function LibrarianLayout({ title, children }) {
  return (
    <div className="librarian-layout">
      <Sidebar />
      <div className="librarian-main">
        <Header title={title} />
        <div className="librarian-content">{children}</div>
      </div>
    </div>
  );
}