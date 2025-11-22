import "../../styles/Dashboard.css";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import libronImage from "../../assets/librarian/libronjamesbgg.png";
import booksIcon from "../../assets/librarian/whitebooks.png";
import { NavLink } from "react-router-dom";

export default function LibrarianDashboard() {
  return (
    <LibrarianLayout title="">

      <div
        className="dashboard-content image-section"
        style={{ backgroundImage: `url(${libronImage})` }}
      >
        <div className="dashboard-wrapper">

          {/* Left side text */}
          <div className="text-section">
            <h2>
              Your Management Hub <br /> at <span>Libron Library.</span>
            </h2>

            <p>
              Every book holds a story, and every librarian helps <br />
              those stories find the right reader. Your work <br />
              brings knowledge to life.
            </p>

            <NavLink to="/librarian/books" className="manage-btn">
              <img src={booksIcon} alt="books" className="btn-icon" />
              <span>Manage Books</span>
            </NavLink>
          </div>
        </div>
      </div>
    </LibrarianLayout>
  );
}
