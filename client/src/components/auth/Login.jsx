import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import useAuth from "@/hooks/useAuth";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import authService from "@/services/authService";
import yupSchemas from "@/utils/yupSchemas";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "@/assets/logoWBG.png";
import ItepSubmissionModal from "@/components/modals/ITEPSubmissionModal";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [openApplicantModal, setOpenApplicantModal] = useState(false);

  const handleSubmit = async (data) => {
    try {
      const response = await authService.login(data);
      if (!response.data.success) {
        toast.error("Invalid Credentials");
      } else {
        toast.success("Login Successfully...!😊");
        const token = response.data.token;
        login(token);
        const user = jwtDecode(token);

        console.log(user.role);

        switch (user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "management":
            navigate("/management");
            break;
          case "technical":
            navigate("/technical-trainer");
            break;
          case "softskill":
            navigate("/softskill-trainer");
            break;
          case "aptitude":
            navigate("/aptitude-trainer");
            break;
          case "labassistant":
            navigate("/labassistant");
            break;
          case "hr":
            navigate("/hr");
            break;
          case "student":
            navigate("/student");
            break;
          case "itep-applicant":
            // navigate("/itep-applicant");
            setOpenApplicantModal(true);
            break;

          default:
            navigate("/not-found");
            break;
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid credentials ❌");
      } else {
        toast.error("Something went wrong 😓");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center h-75 bg-light flex-column">
        <div className="">
          <img
            src={logo}
            alt="IBFMS Logo"
            height="200"
            className="pb-2"
            style={{ objectFit: "contain", borderRadius: "100px" }}
          />
        </div>
        <div
          className="card shadow-sm"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <h3
            className="mb-4 text-center fw-bold"
            style={{ color: "#cf0829ff" }}
          >
            <i className="bi bi-person-circle me-2"></i>Login
          </h3>

          <FormWrapper
            defaultValues={{ email: "", password: "" }}
            schema={yupSchemas.loginSchema}
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <InputField
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <InputField
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="true"
              />
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-3">
              <Button
                type="submit"
                label="Login"
                className="btn btn-primary px-4"
              />
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link
                  to="/signup"
                  className="text-decoration-none text-primary"
                >
                  Sign Up
                </Link>
                <Link
                  to="/reset-password"
                  className="text-decoration-none text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </FormWrapper>
        </div>
      </div>

      <Footer />

      <ItepSubmissionModal
        show={openApplicantModal}
      />
    </>
  );
};

export default Login;
