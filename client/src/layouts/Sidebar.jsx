import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Sidebar = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <motion.div
      animate={{ width: isOpen ? 200 : 70 }}
      transition={{ duration: 0.4, type: "spring", damping: 20 }}
      className="h-100 d-flex flex-column overflow-hidden"
      style={{
        minHeight: "100vh",
        minWidth: isOpen ? "200px" : "70px",
        backgroundColor: "#1a1a1a",
        color: "white",
        zIndex: 1030,
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        {isOpen && (
          <div
            className="d-flex flex-column "
            style={{ minWidth: 100, paddingLeft: "10%" }}
          >
            <div className="ps-3">
              <img
                src={logo}
                alt="IBFMS Logo"
                height="60"
                className=""
                style={{ objectFit: "contain", borderRadius: "100px" }}
              />
            </div>
            <span className="fw-bold pe-2">
              IBF <span style={{ color: "#E63946" }}>Connect</span>
            </span>
          </div>
        )}
        <button
          className="btn btn-sm"
          onClick={toggleSidebar}
          style={{
            color: "white",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Menu List */}
      <ul className="nav flex-column mt-3">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="nav-item px-2"
            style={{ whiteSpace: "nowrap" }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "active-link" : "text-white"
                }`
              }
              style={{ textDecoration: "none" }}
            >
              <item.icon size={18} className="me-2" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
