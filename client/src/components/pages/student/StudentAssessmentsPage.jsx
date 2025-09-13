import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import studentService from "@/services/studentService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  CalendarDays,
  FileCheck,
  FileCode,
  FileEdit,
  FileText,
  FlaskConical,
  Star,
  User,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const StudentAssessmentsPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudentByUserId(user.userId);
      setStudent(response.data || []);
      return response.data || [];
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Student is not found");
      } else toast.error("Error in fetchStudent");

      console.log("Error in  fetchStudent", error);
    }
  };

  const fetchAssessments = async (id) => {
    try {
      const response = await assessmentService.getAllByBatchId(id);
      const assessments = response.data || []
      setAssessments(
        assessments.sort((a, b) => new Date(b.month) - new Date(a.month))
      );
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Assessments is not found");
      } else toast.error("Error in fetchAssessments");

      console.log("Error in  fetchAssessments", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchAssessments(student.assigned_batch._id);
      }
    };

    fetchData();
  }, []);

  function getHighestScore(studentId, assessments) {
    let highest = null;

    for (const assessment of assessments) {
      for (const mark of assessment.marks) {
        if (mark.studentId && mark.studentId._id === studentId) {
          if (highest === null || mark.score > highest) {
            highest = mark.score;
          }
        }
      }
    }

    return highest;
  }

  function getLastAssessmentScore(studentId, assessments) {
    let lastScore = 0;

    const lastAssessment = assessments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    if (lastAssessment && Array.isArray(lastAssessment.marks)) {
      lastAssessment.marks.forEach((mark) => {
        const markStudentId =
          typeof mark.studentId === "object"
            ? mark.studentId._id
            : mark.studentId;

        if (markStudentId === studentId && mark.score > lastScore) {
          lastScore = mark.score;
        }
      });
    }

    return lastScore;
  }

  const highestScore = useMemo(() => {
    if (student && assessments.length > 0) {
      return getHighestScore(student._id, assessments);
    } else return 0;
  }, [student, assessments]);

  const lastScore = useMemo(() => {
    if (student && assessments.length > 0) {
      return getLastAssessmentScore(student._id, assessments);
    } else return 0;
  }, [student, assessments]);

  //Stats data
  const statCards = [
    {
      title: " Total ",
      count: assessments?.length,
      icon: <FileCheck size={18} />,
    },
    {
      title: "Highest Scored",
      count: highestScore,
      icon: <Star size={18} />,
    },
    {
      title: "Last Score",
      count: lastScore,
      icon: <FileCode size={18} />,
    },
  ];

  const assessmentColumns = [
    {
      accessorKey: "title",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Title
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FlaskConical size={16} /> Type
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-capitalize">{row.original.type}</span>
      ),
    },
    {
      accessorKey: "Date",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{dateFormatter(row.original.month)}</span>;
      },
    },
    {
      accessorKey: "trainerName",
      header: () => (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>Trainer</span>
        </div>
      ),
      cell: ({ row }) => {
        const trainerName = row.original.createdBy?.userId?.fullName;
        return <span className="font-medium">{trainerName}</span>;
      },
    },
    {
      accessorKey: "score",
      header: () => (
        <div className="flex items-center gap-2">
          <FileCode size={16} />
          <span>Score</span>
        </div>
      ),
      cell: ({ row }) => {
        let lastScore = 0;

        row.original.marks.forEach((mark) => {
          const markStudentId =
            typeof mark.studentId === "object"
              ? mark.studentId._id
              : mark.studentId;

          if (markStudentId === student?._id && mark.score > lastScore) {
            lastScore = mark.score;
          }
        });

        return <span className="font-medium">{lastScore}</span>;
      },
    },
    {
      accessorKey: "feedback",
      header: () => (
        <div className="flex items-center gap-2">
          <FileEdit size={16} />
          <span>Feedback</span>
        </div>
      ),
      cell: ({ row }) => {
        let feedback = "";

        row.original.marks.forEach((mark) => {
          const markStudentId =
            typeof mark.studentId === "object"
              ? mark.studentId._id
              : mark.studentId;

          if (markStudentId === student?._id && mark?.feedback) {
            feedback = mark.feedback !== "" ? mark.feedback : "N/A";
            return;
          }
        });

        return <span className="font-medium">{feedback}</span>;
      },
    },
  ];

  return (
    <>
      <StatCard cards={statCards} />

      <DataTable
        title=" Assessments "
        data={assessments}
        columns={assessmentColumns}
      />
    </>
  );
};

export default StudentAssessmentsPage;
