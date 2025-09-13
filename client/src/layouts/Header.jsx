import { Link, useLocation } from "react-router-dom";
import logo from '@/assets/logo.png'

export default function Header() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `nav-link px-3 ${
      location.pathname === path
        ? "active text-primary fw-semibold"
        : "text-white fw-semibold"
    }`;

  return (
    <nav
      className="navbar navbar-expand-lg fixed-tobg-dark shadow-sm pb-4 ps-0"
      style={{
        transition: "all 0.3s ease-in-out",
        background: "#cf0829ff", //"linear-gradient(90deg, #cf0829ff 0%, #c57070ff 100%)",
      }}
    >
      <div className="container ps-0 pe-3 pt-2">
        <div className="">
          <img
            src={logo}
            alt="IBFMS Logo"
            height="50"
            className=""
            style={{ objectFit: "contain", borderRadius: "100px" }}
          />
        </div>
        <Link className="navbar-brand fw-bold fs-4 text-white " to="/">
          <i className="bi bi-lightbulb me-2"></i>InfoBeans Foundation
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={navLinkClass("/about")}>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className={navLinkClass("/login")}>
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className={navLinkClass("/signup")}>
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
