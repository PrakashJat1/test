import React, { useState } from "react";

const Button = ({
  type = "button",
  label = "Submit",
  onClick,
  className = "",
  variant = "primary",
  loading = false,
  disabled = false,
  icon = null,
  ...rest
}) => {
  const buttonStyles = {
    fontFamily: "inherit",
    padding: "0.5em 1.2em",
    fontSize: "1rem",
    fontWeight: 500,
    backgroundColor: "var(--primary-color)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  };

  const hoverStyles = {
    backgroundColor: "var(--primary-dark)",
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
      style={{
        ...buttonStyles,
        ...(isHovered ? hoverStyles : {}),
        ...(disabled ? { backgroundColor: "#ccc", cursor: "not-allowed" } : {}),
        backgroundColor :"#cf0829ff"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}

      {icon && <span className="me-1">{icon}</span>}

      {label}
    </button>
  );
};

export default Button;
