import "../../styles/Header.css";
import profileIcon from "../../assets/librarian/profile-icon.png";

export default function Header() {
  return (
    <header className="main-header">
      <h1>
        Welcome Librarian, <span>Dave!</span>
      </h1>

      <div>
        <img className="profile-icon" src={profileIcon} alt="profile" />
      </div>
    </header>
  );
}
