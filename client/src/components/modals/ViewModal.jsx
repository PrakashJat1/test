// components/CentralViewModal.jsx
import { dateFormatter } from "@/utils/dateFormatter";
import { CheckCircle, EyeIcon, LinkIcon, XCircle } from "lucide-react";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ViewModal = ({ show, onClose, title, data, fields }) => {
  const getNestedValue = (obj, keyPath) => {
    return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const checkType = (field) => {
    const value = getNestedValue(data, field.key);

    switch (field.type) {
      case "boolean":
        return value ? (
          <CheckCircle color="green" size={18} />
        ) : (
          <XCircle color="red" size={18} />
        );
      case "date":
        return dateFormatter(value);
      case "datetime":
        return new Date(value).toLocaleString();
      case "image":
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">
            <EyeIcon size={20} />
          </a>
        );
      case "pdf":
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">
            <EyeIcon size={20} />
          </a>
        );
      case "list":
        return Array.isArray(value) && value.length > 0 ? (
          <ul className="mb-0 ps-3">
            {value.map((item, index) => (
              <li key={index}>
                {typeof item === "object" ? JSON.stringify(item) : item}
              </li>
            ))}
          </ul>
        ) : (
          "—"
        );
      case "button":
        return (
          <Button
            type="button"
            onClick={() => field.onClick?.(value, field)}
            label={field.label || "Action"}
          />
        );
      case "link":
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">
            <LinkIcon size={18} className="text-blue-500 hover:underline" />
          </a>
        );

      default:
        return value;
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-bordered">
          <tbody>
            {fields.map((field) => (
              <tr key={field.key}>
                <th style={{ width: "30%" }}>{field.label}</th>
                <td>{checkType(field)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
