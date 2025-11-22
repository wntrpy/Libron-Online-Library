import "../../styles/Dashboard.css";
import LibrarianLayout from "../../components/librarian/LibrarianLayout.jsx";
import loginImage from "../../assets/libron_login.png";

export default function Dashboard() {
  return (
    <LibrarianLayout title="">

      <div
        className="dashboard-content image-section"
        style={{ backgroundImage: `url(${loginImage})` }}
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

            <button className="manage-btn">📚 Manage Books</button>
          </div>
        </div>
      </div>
    </LibrarianLayout>
  );
}
