import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import authService from "@/services/authService";
import yupSchemas from "@/utils/yupSchemas";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "@/assets/logoWBG.png";

const ResetPassword = () => {
  const handleSubmit = async (data) => {
    const newData = {
      email: data.email,
      newPassword: data.newPassword,
    };

    try {
      const response = await authService.resetPassword(newData);
      if (response.data.success) {
        toast.success(response.data.message);
        return;
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Invalid Email ❌");
      } else {
        toast.error("Something went wrong 😓");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container py-4 ">
        <div className="row justify-content-center flex-column">
          <div className=" d-flex justify-content-center">
            <img
              src={logo}
              alt="IBFMS Logo"
              height="200"
              className="pb-2"
              style={{ objectFit: "contain", borderRadius: "100px" }}
            />
          </div>
          <div className=" d-flex justify-content-center">
            <div className="card shadow rounded-4 p-5 " style={{width : "40%"}}>
              <h3
                className="text-center mb-4 fw-bold"
                style={{ color: "#cf0829ff" }}
              >
                Reset Password
              </h3>

              <FormWrapper
                defaultValues={{
                  email: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                schema={yupSchemas.resetPasswordSchema}
                onSubmit={handleSubmit}
              >
                <InputField
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  label="Email"
                />

                <InputField
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  label="New Password"
                  autoComplete="true"
                />

                <InputField
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  label="Confirm Password"
                  autoComplete="true"
                />

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button type="submit" label="Reset" />
                  <Link
                    to="/login"
                    className="text-decoration-none text-primary fw-semibold"
                  >
                    Back to Login
                  </Link>
                </div>
              </FormWrapper>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ResetPassword;
