import { Modal, Button } from "react-bootstrap";
import React from "react";

const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold text-dark">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-secondary">{message}</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal;
