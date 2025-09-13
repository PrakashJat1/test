import useAuth from "@/hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  if (!user) return null;

  // Token + User exists → check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
