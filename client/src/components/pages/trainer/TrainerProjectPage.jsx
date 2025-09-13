import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import projectService from "@/services/projectService";
import trainerService from "@/services/trainerService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import {
  AlarmClock,
  BookOpenIcon,
  CalendarCheck,
  Eye,
  FileCode2,
  GitBranchPlus,
  LayoutGridIcon,
  MessageSquareCode,
  Pencil,
  PencilIcon,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TrainerProjectPage = () => {
  const user = useAuth().user;
  const [trainer, setTrainer] = useState(null);
  const [allProjects, setAllProjects] = useState([]);

  const [selectedRow, setSelectedRow] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(false);

  const fetchTrainer = async () => {
    try {
      const response = await trainerService.getTrainerByUserId(user.userId);
      setTrainer(response.dat || []);
      return response.data || []
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Trainer is not found");
      } else toast.error("Error in fetchTrainer");

      console.log("Error in  fetchTrainer", error);
    }
  };

  const fetchAllProjects = async (trainer) => {
    try {
      const payLoad = {
        batchIds: trainer?.assigned_Batches,
      };
      const response = await projectService.getAllProjectsByBatchIds(payLoad);
      setAllProjects(response.data || []);
    } catch (error) {
      toast.error("Error in fetching getAllProjects");
      console.log("Error in fetching getAllProjects", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainer = await fetchTrainer();
        fetchAllProjects(trainer);
      } catch (error) {
        console.log("Error in useEffect", error);
      }
    };
    fetchData();
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
    {
      accessorKey: "editfeedback",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Pencil size={16} />
          Give Feedback
        </div>
      ),
      cell: ({ row }) => (
        <>
          <PencilIcon
            size={14}
            className="me-1"
            onClick={() => {
              setSelectedRow(row.original), setFeedbackModal(true);
            }}
          />
        </>
      ),
    },
  ];

  const handleFeedbackSubmit = async (data) => {
    try {
      const payLoad = {
        id: selectedRow._id,
        feedback: data.feedback,
      };
      // console.log(payLoad);
      await projectService.updateFeedbackById(payLoad);
      toast.success("Feedback Updated");
      fetchAllProjects(trainer);
    } catch (error) {
      toast.error("Error in handleFeedbackSubmit");
      console.log("Error in handleFeedbackSubmit", error);
    } finally {
      setFeedbackModal(false);
    }
  };

  const FeedbackForm = () => (
    <FormWrapper
      defaultValues={{
        feedback: selectedRow?.feedbacks?.byTrainer || "",
      }}
      schema={yupSchemas.projectFeedbackSchema}
      onSubmit={handleFeedbackSubmit}
    >
      <InputField
        name="feedback"
        label="Feedback"
        placeholder="Enter the feedback"
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update" />
        <button
          className="btn btn-secondary"
          onClick={() => setFeedbackModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      <StatCard cards={projectStatCards} />

      <DataTable
        title="Projects "
        data={allProjects}
        columns={projectsColumns}
      />

      <FormModal
        show={feedbackModal}
        onClose={() => {
          setSelectedRow(null), setFeedbackModal(false);
        }}
        title={`${selectedRow?.title} - ${selectedRow?.studentId?.userId?.fullName}`}
        formWrapper={<FeedbackForm />}
      />
    </>
  );
};

export default TrainerProjectPage;
