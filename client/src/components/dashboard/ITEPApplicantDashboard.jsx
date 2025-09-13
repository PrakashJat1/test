import useAuth from "@/hooks/useAuth";
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ITEPApplicantDashboard = () => {
  const { logout } = useAuth();
  return <Button onClick={logout}>Logout</Button>;
};

export default ITEPApplicantDashboard;
