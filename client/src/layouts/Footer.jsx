import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className=" text-white pt-5 pb-3 mt-5"
      style={{
        background: "#cf0829ff", //"linear-gradient(90deg, #cf0829ff 0%, #c57070ff 100%)",
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* Brand & Mission */}
          <div className="col-md-6">
            <h4 className="fw-bold">
              <i className="bi bi-lightbulb me-2"></i>InfoBeans Foundation
            </h4>
            <p className="mb-0">Empowering Communities, Transforming Lives.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h6 className="text-uppercase fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-1">
                <Link
                  to="/"
                  className="text-decoration-none text-white-50 footer-link-hover"
                >
                  <i className="bi bi-house-door me-2"></i>Home
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/about"
                  className="text-decoration-none text-white-50 footer-link-hover"
                >
                  <i className="bi bi-info-circle me-2"></i>About Us
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/login"
                  className="text-decoration-none text-white-50 footer-link-hover"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-decoration-none text-white-50 footer-link-hover"
                >
                  <i className="bi bi-person-plus me-2"></i>Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info (Optional) */}
          <div className="col-md-3">
            <h6 className="text-uppercase fw-semibold">Contact</h6>
            <p className="mb-1 small">
              <i className="bi bi-envelope me-2"></i>contact@infobeans.org
            </p>
            <p className="mb-0 small">
              <i className="bi bi-geo-alt me-2"></i>Indore, India
            </p>
          </div>
        </div>

        <hr className="border-top border-light mt-4" />
        <div className="text-center small text-white-50">
          &copy; {new Date().getFullYear()} InfoBeans Foundation. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}
