import React from "react";
import { Modal } from "react-bootstrap";

const FormModal = ({title, formWrapper, onClose, show}) => {
  return (
    <>
      <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold text-dark">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-secondary">{formWrapper}</Modal.Body>

        {/* <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onSubmit}>
            Confirm
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default FormModal;
