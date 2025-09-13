import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import { MoreVertical } from "lucide-react";

const StatCard = ({ cards = [] }) => {
  return (
    <div className="d-flex gap-4 justify-content-center">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="shadow border-0 position-relative flex-shrink-0"
          style={{
            width: "260px",
            minHeight: "120px",
            backgroundColor: "var(--bg-light)",
            color: "var(--text-color)",
            borderRadius: "1rem",
          }}
        >
          <Card.Body className="p-3 d-flex flex-column justify-content-between">
            {/* Dropdown */}
            {/* <Dropdown className="position-absolute top-0 end-0 m-2">
              <Dropdown.Toggle
                variant="light"
                className="btn-sm border-0 p-1"
                style={{ backgroundColor: "transparent" }}
              >
                <MoreVertical size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={card.onView}>View</Dropdown.Item>
                <Dropdown.Item onClick={card.onEdit}>Edit</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

            {/* Title & Count */}
            <div className="d-flex flex-column gap-1">
              <div className="d-flex align-items-center gap-2">
                <span className="fs-4 text-muted">{card.icon}</span>
                <h6 className="mb-0 fw-semibold text-uppercase text-secondary">
                  {card.title}
                </h6>
              </div>
              <h2 className="fw-bold text-primary mb-0">{card.count}</h2>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default StatCard;
