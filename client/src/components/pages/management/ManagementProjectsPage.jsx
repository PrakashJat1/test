import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import projectService from "@/services/projectService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  AlarmClock,
  BookOpenIcon,
  CalendarCheck,
  Eye,
  FileCode2,
  GitBranchPlus,
  LayoutGridIcon,
  MessageSquareCode,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementProjectsPage = () => {
  const [allProjects, setAllProjects] = useState([]);

  const fetchAllProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setAllProjects(response.data || []);
    } catch (error) {
      toast.error("Error in fetching getAllProjects");
      console.log("Error in fetching getAllProjects", error);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const getCountOfParticipatedBatches = () => {
    const set = new Set();
    allProjects.forEach((project) => {
      set.add(project.batchId);
    });
    return set.size;
  };

  //Stats data
  const projectStatCards = [
    {
      title: "Total Projects",
      count: allProjects.length,
      icon: <FileCode2 size={18} />,
    },
    {
      title: "Batches Participated",
      count: getCountOfParticipatedBatches(),
      icon: <LayoutGridIcon size={18} />,
    },
    {
      title: "Projects With Feedback",
      count: allProjects.filter((p) => p.feedbacks?.byTrainer).length,
      icon: <MessageSquareCode size={18} />,
    },
    {
      title: "Pending Feedback",
      count: allProjects.filter((p) => p.feedbacks?.byTrainer == "").length,
      icon: <AlarmClock size={18} />,
    },
  ];

  const projectsColumns = [
    {
      accessorKey: "name",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Student Name
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.original.studentId?.userId?.fullName}
          </span>
        );
      },
    },
    {
      accessorKey: "batchname",
      header: () => (
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Batch Name</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.original.batchId?.batch_Name}
          </span>
        );
      },
    },
    {
      accessorKey: "projecttitle ",
      header: () => (
        <div className="flex items-center gap-2">
          <BookOpenIcon size={16} />
          <span>Project Title</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.title}</span>;
      },
    },

    {
      accessorKey: "githubLink",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <GitBranchPlus size={16} /> Github Link
        </div>
      ),
      cell: ({ row }) => (
        <a target="_blank" href={row.original.githubLink}>
          <Eye size={18} />
        </a>
      ),
    },

    {
      accessorKey: "submittedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarCheck size={16} /> Submitted On
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.submittedOn),
    },
    {
      accessorKey: "feedback",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <MessageSquareCode size={16} /> Feedback
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.original.feedbacks?.byTrainer}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <StatCard cards={projectStatCards} />

      <DataTable
        title=" Projects "
        data={allProjects}
        columns={projectsColumns}
      />
    </>
  );
};

export default ManagementProjectsPage;
