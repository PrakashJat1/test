import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { UserCircle } from "lucide-react";
import FormModal from "@/components/modals/FormModal";
import FormWrapper from "@/components/common/Form/FormWrapper";
import yupSchemas from "@/utils/yupSchemas";
import InputField from "@/components/common/Form/InputField";
import { toast } from "react-toastify";
import userService from "@/services/userService";

const ProfileViewModal = ({ show, onClose, user }) => {
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [userVerifyModal, setUserVerifyModal] = useState(false);
  if (!user) return null;

  const { _id, fullName, email, mobileNo, role, status } = user;

  const handleEditProfile = async (data) => {
    try {
      const payLoad = {
        id: user._id,
        fullName: data.fullName,
        email: data.email,
        mobileNo: data.mobileNo,
        password: data.password,
      };

      await userService.updateUserProfileById(payLoad);
    } catch (error) {
      if (error.response.status === 409) toast.warning(error.response.message);
      else toast.error("Error in handleEditProfile");
      console.log("Error in handleEditProfile", error);
    } finally {
      setEditProfileModal(false);
    }
  };

  const handleVerifyUser = async (data) => {
    if (data.password.trim() === "")
      return toast.warn("Password can not be empty");

    try {
      const payLoad = {
        id: _id,
        password: data.password,
      };
      await userService.verifyUser(payLoad);
      setEditProfileModal(true);
      toast.success("Verified 😊");
      setUserVerifyModal(false);
    } catch (error) {
      if (error.response.status === 409) toast.warning(error.response.data);
      else toast.error("Error in handleVerifyUser");
      console.log("Error in handleVerifyUser", error);
    }
  };

  const VerifyUserForm = () => (
    <FormWrapper
      defaultValues={{ password: "" }}
      schema={yupSchemas.verifyUserSchema}
      onSubmit={handleVerifyUser}
    >
      <InputField
        type="password"
        name="password"
        label="Password"
        placeholder="Enter your Password"
      />
      <div className="d-flex justify-content-around">
        <Button variant="primary" type="submit">
          Verify
        </Button>
        <Button variant="secondary" onClick={() => setUserVerifyModal(false)}>
          Close
        </Button>
      </div>
    </FormWrapper>
  );

  const EditUserForm = () => (
    <FormWrapper
      defaultValues={{
        fullName: user.fullName,
        email: user.email,
        mobileNo: user.mobileNo,
        password: "",
        confirmPassword: "",
      }}
      onSubmit={handleEditProfile}
      schema={yupSchemas.editProfileSchema}
    >
      <InputField type="text" name="fullName" label="Full Name" />
      <InputField type="email" name="email" label="Email" />
      <InputField type="text" name="mobileNo" label="Mobile Number : " />
      <InputField type="password" name="password" label="New Password : " />
      <InputField
        type="password"
        name="confirmPassword"
        label="Confirm Password : "
      />
      <div className="d-flex justify-content-around">
        <Button variant="primary" type="submit">
          Update
        </Button>
        <Button variant="secondary" onClick={() => setEditProfileModal(false)}>
          Close
        </Button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <UserCircle size={22} className="me-2 text-primary" />
            Profile Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Name :</strong>
            <div>{fullName}</div>
          </div>
          <div className="mb-3">
            <strong>Email :</strong>
            <div>{email}</div>
          </div>
          <div className="mb-3">
            <strong>Mobile Number :</strong>
            <div>{mobileNo}</div>
          </div>
          <div className="mb-3">
            <strong>Role :</strong>
            <div>{role}</div>
          </div>
          <div className="mb-3">
            <strong>Status :</strong>
            <div className={status ? "text-info" : "text-danger"}>
              {status ? "Active" : "Blocked"}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              onClose(), setUserVerifyModal(true);
            }}
          >
            Edit
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <FormModal
        title="Verify it's you..!"
        show={userVerifyModal}
        onClose={() => setUserVerifyModal(false)}
        formWrapper={<VerifyUserForm />}
      />
      <FormModal
        title="Edit Profile "
        show={editProfileModal}
        onClose={() => setEditProfileModal(false)}
        formWrapper={<EditUserForm />}
      />
    </>
  );
};

export default ProfileViewModal;
