import StudentDashboardCard from "@/components/common/UI/StudentDashboardCard";
import useAuth from "@/hooks/useAuth";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import bookissueService from "@/services/bookissueService";
import projectService from "@/services/projectService";
import saturdaysessionService from "@/services/saturdaysessionService";
import studentService from "@/services/studentService";
import { BookOpen, FileCheck, FileCode, Gauge } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const StudentDashboardPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [bookIssued, setBookIssued] = useState([]);
  const [sessions, setSessions] = useState([]);

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudentByUserId(user.userId);
      setStudent(response.data || []);
      return response.data || []
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Student is not found");
      } else toast.error("Error in fetchStudent");

      console.log("Error in  fetchStudent", error);
    }
  };

  const fetchProjects = async (id) => {
    try {
      const response = await projectService.getAllProjectsByStudentId(id);
      setProjects(response.data || []);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Projects is not found");
      } else toast.error("Error in fetchProjects");

      console.log("Error in  fetchProjects", error);
    }
  };

  const fetchAssessments = async (id) => {
    try {
      const response = await assessmentService.getAllByBatchId(id);
      setAssessments(response.data || []);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Assessments is not found");
      } else toast.error("Error in fetchAssessments");

      console.log("Error in  fetchAssessments", error);
    }
  };

  const fetchBookIssued = async (id) => {
    try {
      const response = await bookissueService.getIssueRequestByStudentId(id);
      setBookIssued(response.data || []);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("BookIssued is not found");
      } else toast.error("Error in fetchBookIssued");

      console.log("Error in  fetchBookIssued", error);
    }
  };

  const fetchSessions = async (id) => {
    try {
      const response =
        await saturdaysessionService.getAllSaturdaySessionsByStudentId(id);
      setSessions(response.data || []);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Sessions are not found");
      } else toast.error("Error in fetchSessions");

      console.log("Error in  fetchSessions", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchProjects(student._id);
        await fetchAssessments(student.assigned_batch._id);
        await fetchBookIssued(student._id);
        await fetchSessions(student._id);
      }
    };

    fetchData();
  }, []);

  //getAverageScore
  function getAverageScoreByStudentId(assessments, targetStudentId) {
    let totalScore = 0;
    let count = 0;

    assessments.length > 0
      ? assessments.forEach((assessment) => {
          assessment.marks.forEach((mark) => {
            if (mark.studentId._id === targetStudentId) {
              totalScore += mark.score;
              count++;
            }
          });
        })
      : 0;

    return count > 0 ? (totalScore / count).toFixed(2) : 0;
  }

  //getLastScoresByType
  function getLastScoresByType(studentId) {
    const lastScores = {
      technical: null,
      softskill: null,
      aptitude: null,
    };

    // Sort by createdAt descending
    const sortedAssessments = assessments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Loop through assessments
    for (let assessment of sortedAssessments) {
      const mark = assessment.marks.find((m) => m.studentId._id === studentId);
      if (mark && !lastScores[assessment.type]) {
        lastScores[assessment.type] = mark.score;
      }
      // Stop early if all three found
      if (
        lastScores.technical !== null &&
        lastScores.softskill !== null &&
        lastScores.aptitude !== null
      ) {
        break;
      }
    }

    return lastScores;
  }

  function getUpcomingSession(currentBatchId) {
    const now = new Date();
    const upcoming = sessions
      .filter(
        (s) =>
          new Date(s.date) > now && // only future sessions
          s.batchIds.some((batch) =>
            typeof batch === "object"
              ? batch._id == currentBatchId
              : batch == currentBatchId
          )
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    return upcoming || null;
  }

  const lastscore = useMemo(() => {
    if (student?._id) {
      return getLastScoresByType(student?._id);
    }
    return null;
  }, [assessments?.length, student?._id]);

  const nextSession = useMemo(() => {
    if (student?.assigned_batch?._id) {
      return getUpcomingSession(student.assigned_batch._id);
    }
    return null;
  }, [sessions?.length, student?._id]);

  //Stats data
  const statCards = [
    {
      title: "Assessments",
      count: assessments?.length,
      icon: <FileCheck size={18} />,
    },
    {
      title: "Average Score",
      count: getAverageScoreByStudentId(assessments, student?._id),
      icon: <Gauge size={18} />,
    },
    {
      title: "Projects Submitted",
      count: projects?.length,
      icon: <FileCode size={18} />,
    },
    {
      title: "Books Issued",
      count: bookIssued?.length,
      icon: <BookOpen size={18} />,
    },
  ];

  return (
    <>
      <StatCard cards={statCards} />
      <StudentDashboardCard lastScores={lastscore} nextSession={nextSession} />
    </>
  );
};

export default StudentDashboardPage;
