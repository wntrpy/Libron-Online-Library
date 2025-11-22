import React, { useMemo, useState } from "react";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import "../../styles/Reports.css";
import downloadIcon from "../../assets/librarian/downloadIcon.png";

const sample = new Array(70).fill(0).map((_, i) => ({
  id: `2022100${i}`,
  name: "Ruby Cristostomo",
  book: "Harry Potter",
  dateBorrowed: "2025-11-22",
  dueDate: "2025-11-25",
  dateReturned: "2025-11-22",
  librarianId: `0000${22 + i}`,
}));

export default function Reports() {
  const [selectedDate, setSelectedDate] = useState("2025-11-22");

  const filtered = useMemo(() => {
    if (!selectedDate) return sample;
    return sample.filter((r) => r.dateBorrowed === selectedDate);
  }, [selectedDate]);

  function handlePrint() {
    window.print();
  }

  return (
    <LibrarianLayout title="Generate Reports">
      <div className="requests-page">
        <div className="requests-header reports-header">
          <div className="requests-title">
            <h2>List of Borrow Transactions</h2>
          </div>

          <div className="reports-date">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="requests-card">
          <div className="table-scroll">
            <table className="requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>BORROWED BOOK</th>
                <th>DATE BORROWED</th>
                <th>DUE DATE</th>
                <th>DATE RETURNED</th>
                <th>Librarian ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "24px 0" }}>
                    No records found for the selected date.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.book}</td>
                    <td>{r.dateBorrowed}</td>
                    <td>{r.dueDate}</td>
                    <td>{r.dateReturned}</td>
                    <td>{r.librarianId}</td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>

        <div className="reports-print">
          <button className="print-btn" onClick={handlePrint}>
            <img src={downloadIcon} alt="download" style={{ width: 16, height: 16 }} />
            Print
          </button>
        </div>
      </div>
    </LibrarianLayout>
  );
}
