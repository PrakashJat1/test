import { dateFormatter } from "@/utils/dateFormatter";
import React from "react";
import { Card } from "react-bootstrap";

//for extracting top and bottom 5 students by an assessment marks
const getTopBottomScorers = (marks = []) => {
  const sorted = [...marks].sort((a, b) => b.score - a.score);
  return {
    top5: sorted.slice(0, 5),
    bottom5: sorted.slice(-5).reverse(),
  };
};

const TrainerAssessmentHighlights = ({ assessments }) => {
  const batchMap = new Map();

  assessments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((a) => {
      const batchId = a.batchId?._id;
      if (!batchMap.has(batchId)) {
        batchMap.set(batchId, a);
      }
    });

  const latestAssessments = Array.from(batchMap.values());

  return (
    <Card className="shadow border-0 h-100 w-100 pt-5">
      <Card.Body className="pt3">
        {latestAssessments.map((assessment) => {
          const batch = assessment.batchId;
          const { top5, bottom5 } = getTopBottomScorers(assessment.marks || []);
          const title = assessment.title;
          const date = dateFormatter(assessment.createdAt);

          return (
            <div key={assessment._id}>
              <Card.Title className="text-center text-primary pt-5">
                {batch?.batch_Name} – {title}
              </Card.Title>
              <p className="text-center text-muted pt-1">Date: {date}</p>

              <div className="row">
                <div className="col-6">
                  <h6 className="text-success pt-1">Top 5 Scorers</h6>
                  <ul className="list-group">
                    {top5.map((s, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center pt-1"
                      >
                        {s.studentId?.userId?.fullName || "Unknown"}
                        <span className="badge bg-success">{s.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-6">
                  <h6 className="text-danger">Bottom 5 Scorers</h6>
                  <ul className="list-group">
                    {bottom5.map((s, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {s.studentId?.userId?.fullName || "Unknown"}
                        <span className="badge bg-danger">{s.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default TrainerAssessmentHighlights;
