import "../../styles/Sidebar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/librarian/logoicon.png";
import dashboard_Icon from "../../assets/librarian/dashboardicon.png";
import books_Icon from "../../assets/librarian/booksicon.png";
import requests_Icon from "../../assets/librarian/requestsicon.png";
import borrowed_Icon from "../../assets/librarian/borrowedicon.png";
import reports_Icon from "../../assets/librarian/reportsicon.png";

const icons = {
  dashboard: dashboard_Icon,
  books: books_Icon,
  requests: requests_Icon,
  returns: borrowed_Icon,
  reports: reports_Icon,
};

export default function Sidebar() {
  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" />
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/librarian/dashboard" className={linkClass}>
            {icons.dashboard && (
              <img src={icons.dashboard} alt="" className="nav-icon" />
            )}
            <span className="nav-label">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/librarian/books" className={linkClass}>
            {icons.books && <img src={icons.books} alt="" className="nav-icon" />}
            <span className="nav-label">Books</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/librarian/requests" className={linkClass}>
            {icons.requests && (
              <img src={icons.requests} alt="" className="nav-icon" />
            )}
            <span className="nav-label">Requests</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/librarian/returns" className={linkClass}>
            {icons.returns && <img src={icons.returns} alt="" className="nav-icon" />}
            <span className="nav-label">Returns</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/librarian/reports" className={linkClass}>
            {icons.reports && <img src={icons.reports} alt="" className="nav-icon" />}
            <span className="nav-label">Reports</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}