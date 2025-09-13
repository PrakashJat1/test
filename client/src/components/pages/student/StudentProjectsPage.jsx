import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import projectService from "@/services/projectService";
import studentService from "@/services/studentService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  CalendarDays,
  Eye,
  FileCheck,
  FileCode,
  FileEdit,
  FileText,
  LinkIcon,
  MessageCircleQuestionMarkIcon,
  User,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const StudentProjectsPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchProjects(student._id);
      }
    };

    fetchData();
  }, []);

  const feedbackCount = useMemo(() => {
    if (student && projects.length > 0) {
      let feedbackCount = 0;
      projects.forEach((project) => {
        if (
          project.studentId === student._id &&
          project?.feedbacks?.byTrainer !== ""
        )
          feedbackCount++;
      });
      return feedbackCount;
    }
  }, [student, projects]);

  //Stats data
  const statCards = [
    {
      title: " Total ",
      count: projects.length,
      icon: <FileCheck size={18} />,
    },
    {
      title: " Feedbacks Received ",
      count: feedbackCount || 0,
      icon: <FileCode size={18} />,
    },
    {
      title: "Feedbacks Pending",
      count: projects.length - feedbackCount || 0,
      icon: <MessageCircleQuestionMarkIcon size={18} />,
    },
  ];

  const projectColumns = [
    {
      accessorKey: "title",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Title
        </div>
      ),
    },
    {
      accessorKey: "githubLink",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <LinkIcon size={16} /> Github Link
        </div>
      ),
      cell: ({ row }) => (
        <a
          href={row.original.githubLink}
          target="_blank"
          title="githublink"
          className="text-capitalize"
        >
          {<Eye size={18} />}
        </a>
      ),
    },
    {
      accessorKey: "submittedOn",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>Submitted On</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{dateFormatter(row.original.submittedOn)}</span>;
      },
    },
    {
      accessorKey: "trainerName",
      header: () => (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>Tech Trainer</span>
        </div>
      ),
      cell: ({ row }) => {
        const trainerName =
          row.original.batchId?.technicalTrainer?.userId?.fullName;
        return <span className="font-medium">{trainerName}</span>;
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
        const Feedback =
          row.original.feedbacks?.byTrainer !== ""
            ? row.original.feedbacks?.byTrainer
            : "N/A";
        return <span className="font-medium">{Feedback}</span>;
      },
    },
  ];

  return (
    <>
      <StatCard cards={statCards} />

      <DataTable title=" Projects " data={projects} columns={projectColumns} />
    </>
  );
};

export default StudentProjectsPage;
