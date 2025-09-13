import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ItepSubmissionModal = ({ show, handleClose }) => {
  const navigate = useNavigate();
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Application Submitted 👍</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your application is submitted successfully!</p>
        <p>You will get an email from our side if you are selected.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => navigate("/")}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItepSubmissionModal;
