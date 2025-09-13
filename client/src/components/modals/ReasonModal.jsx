import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ReasonModal = ({ show, onClose, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionModal, setRejectionModal] = useState(show);
  const [customModal, setCustomModal] = useState(false);

  useEffect(() => {
    if (!rejectionModal) {
      setRejectionReason("");
      setCustomModal(false);
    }
  }, [rejectionModal]);

  const handleReject = () => {
    if (!rejectionReason || rejectionReason.trim() === "") return toast.warning("Please provide reason");
    onReject?.(rejectionReason);
    onClose();
    setRejectionReason("");
  };

  return (
    <>
      {/* Preset Reason Modal */}
      <Modal centered show={show} onHide={onClose}>
        <div className="p-4 rounded-4">
          <h4 className="text-center fw-semibold mb-4">
            📌 Reason for Rejection
          </h4>

          <Modal.Body>
            <select
              className="form-select mb-3 shadow-sm rounded-3"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              style={{ background: "#f8f9fa" }}
            >
              <option value="" disabled>
                -- Select a reason --
              </option>
              <option>Invalid degree eligibility</option>
              <option>Not a final year or graduate</option>
              <option>Incomplete registration form</option>
              <option>Please visit the center</option>
            </select>
          </Modal.Body>

          <div className="d-flex justify-content-end gap-3 px-3 pb-3">
            <Button
              variant="danger"
              className="rounded-pill px-4"
              onClick={handleReject}
            >
              🚫 Confirm
            </Button>
            <Button
              variant="secondary"
              className="rounded-pill"
              onClick={() => {
                setCustomModal(true);
                setRejectionModal(false);
                onClose();
              }}
            >
              ✏️ Custom
            </Button>
            <Button
              variant="outline-secondary"
              className="rounded-pill"
              onClick={() => {
                onClose, setRejectionReason("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom Reason Modal */}
      <Modal centered show={customModal} onHide={() => setCustomModal(false)}>
        <Modal.Header className="border-0">
          <h4 className="text-center w-100 fw-semibold mb-0">
            ✍️ Enter Custom Reason
          </h4>
        </Modal.Header>

        <Modal.Body>
          <input
            type="text"
            className="form-control shadow-sm rounded-3"
            placeholder="Enter your reason here"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer className="border-0 d-flex justify-content-end gap-3">
          <Button
            variant="danger"
            className="rounded-pill px-4"
            onClick={handleReject}
          >
            🚫 Confirm
          </Button>
          <Button
            variant="outline-secondary"
            className="rounded-pill"
            onClick={() => {
              setCustomModal(false), setRejectionReason("");
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReasonModal;
