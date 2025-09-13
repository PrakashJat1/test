import { dateFormatter } from "@/utils/dateFormatter";
import React from "react";
import { Card, Container, Row } from "react-bootstrap";

const AssignedBatchesCard = ({ assignedBatches, trainerId }) => {
  const getTrainerType = (batch) => {
    if (batch?.technicalTrainer === trainerId) return "Technical";
    if (batch?.softskillTrainer === trainerId) return "Soft Skill";
    if (batch?.aptitudeTrainer === trainerId) return "Aptitude";
    return "Unknown";
  };

  return (
    <Card className="shadow-lg h-100 w-100">
      <Card.Body>
        <h4 className="text-center fw-bold text-primary ">
          Assigned Batches
        </h4>

        {assignedBatches?.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {assignedBatches.map((batch, idx) => (
              <Card key={idx} border="info" className="flex-row shadow-sm">
                <div
                  className="d-flex align-items-center p-3 bg-light border-end"
                  style={{ minWidth: "200px" }}
                >
                  <h5 className="mb-0 text-info">Batch {batch?.batch_No}</h5>
                </div>
                <Card.Body>
                  <Card.Title className="mb-2">{batch?.batch_Name}</Card.Title>
                  <Card.Text className="mb-1">
                    <strong>Subject:</strong> {getTrainerType(batch)}
                  </Card.Text>
                  <Card.Text>
                    <strong>End Date:</strong>{" "}
                    {dateFormatter(batch?.end_Date)}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No batches assigned yet.</p>
        )}
      </Card.Body>
    </Card>
  );
};


export default AssignedBatchesCard;
