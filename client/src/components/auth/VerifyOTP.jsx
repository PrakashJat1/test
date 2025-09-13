import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import ItepSubmissionModal from "@/components/modals/ITEPSubmissionModal";
import authService from "@/services/authService";
import yupSchemas from "@/utils/yupSchemas";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const location = useLocation();
  const userData = location.state?.userData;
  const [openApplicantModal, setOpenApplicantModal] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    handleTimer();
  }, []);

  const handleTimer = () => {
    setIsResendDisabled(true);
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (data) => {
    const newData = {
      email: userData.email,
      otp: data.otp,
    };

    try {
      await authService.verifyOTP(newData);
      setOpenApplicantModal(true);
      toast.success("Registered successfully...!😊");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(" Invalid or expired OTP");
      } else {
        toast.error("Something went wrong 😓");
      }
    }
  };

  const resendOTP = async () => {
    const newData = {
      fullName: userData.fullName,
      email: userData.email,
    };

    let response = null;
    try {
      response = await authService.resendOTP(newData);

      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(response.data.message);
      } else {
        toast.error("Something went wrong 😓");
      }
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="bg-white p-5 rounded-4 shadow-lg"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h4 className="mb-4 text-center text-primary">
            OTP sent to <br />
            <span className="fw-semibold">{userData.email}</span>
          </h4>

          <FormWrapper
            defaultValues={{ otp: "" }}
            schema={yupSchemas.verifyOTPSchema}
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <InputField name="otp" type="text" placeholder="Enter OTP" />
            </div>

            <div className="d-grid gap-2">
              <Button type="submit" className="btn btn-primary">
                Verify OTP
              </Button>

              <Button onClick={resendOTP} className="btn btn-outline-secondary" disabled={isResendDisabled}>
                {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </Button>
            </div>
          </FormWrapper>
        </div>
      </div>
      <ItepSubmissionModal show={openApplicantModal} />
    </>
  );
};

export default VerifyOTP;
