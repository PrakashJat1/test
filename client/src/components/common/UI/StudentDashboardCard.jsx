import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Gauge, CalendarClock } from "lucide-react";
import { dateFormatter } from "@/utils/dateFormatter";

const StudentDashboardCard = ({ lastScores, nextSession }) => {
  return (
    <Row className="g-4 p-4">
      {/* Card 1: Last Assessment Scores */}
      <Col md={6}>
        <Card className="shadow-sm border-0 rounded-4 h-100">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <Gauge className="me-2 text-primary" />
              <Card.Title className="mb-0">Last Assessment Scores</Card.Title>
            </div>
            <div className="d-flex flex-column gap-2">
              <div>
                <strong>Technical:</strong> {lastScores?.technical ?? "N/A"}
              </div>
              <div>
                <strong>Soft Skill:</strong> {lastScores?.softskill ?? "N/A"}
              </div>
              <div>
                <strong>Aptitude:</strong> {lastScores?.aptitude ?? "N/A"}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Card 2: Upcoming Saturday Session */}
      <Col md={6}>
        <Card className="shadow-sm border-0 rounded-4 h-100">
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <CalendarClock className="me-2 text-success" />
              <Card.Title className="mb-0">Upcoming Session</Card.Title>
            </div>

            {nextSession ? (
              <div className="d-flex flex-column gap-1">
                <div>
                  <strong>Topic:</strong> {nextSession?.topic}
                </div>
                <div>
                  <strong>Expert:</strong> {nextSession?.ExpertName}
                </div>
                <div>
                  <strong>Company:</strong> {nextSession?.company}
                </div>
                <div>
                  <strong>Position:</strong> {nextSession?.position}
                </div>
                <div>
                  <strong>Date:</strong> {dateFormatter(nextSession?.date)}
                </div>
                <div>
                  <strong>Time:</strong> {nextSession?.timeFrom}
                  {" - "}
                  {nextSession.timeTo}
                </div>
              </div>
            ) : (
              <div className="text-muted">
                No upcoming session scheduled yet.
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentDashboardCard;
