import AssessmentFormModal from "@/components/modals/AssessmentFormModal";
import ViewModal from "@/components/modals/ViewModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import trainerService from "@/services/trainerService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  Eye,
  FileText,
  FlaskConical,
  Repeat2,
  Tag,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const TrainerAssessmentsPage = () => {
  const user = useAuth().user;
  const [trainer, setTrainer] = useState(null);
  const [allAssessments, setAllAssessments] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [createdAssessment, setCreatedAssessment] = useState(null);
  const [editAssessmentModal, setEditAssessmentModal] = useState(false);

  const fetchTrainer = async () => {
    try {
      const response = await trainerService.getTrainerByUserId(user.userId);
      setTrainer(response.data || []);
      return response.data || [];
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Trainer is not found");
      } else toast.error("Error in fetchTrainer");

      console.log("Error in  fetchTrainer", error);
    }
  };

  const fetchAllAssessments = async (trainer) => {
    try {
      const response = await assessmentService.getAllAssessmentsByTrainerId(
        trainer?._id
      );
      setAllAssessments(response.data || []);
    } catch (error) {
      toast.error("Error in fetching allAssessments");
      console.log("Error in fetching allAssessments", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainer = await fetchTrainer();
        fetchAllAssessments(trainer);
      } catch (error) {
        console.log("Error in useEffect", error);
      }
    };
    fetchData();
  }, []);

  const assessmentStats = [
    {
      title: "Total Assessments",
      count: allAssessments.length,
      icon: <FileText size={18} />,
    },
    // {
    //   title: "Top Scorer",
    //   count: (allAssessments) => {
    //     // Flatten all scores from all assessments into a single array
    //     const allMarks = allAssessments.flatMap((a) => a.marks || []);

    //     if (allMarks.length === 0) return "N/A";

    //     // Reduce to find highest score
    //     const top = allMarks.reduce((prev, current) =>
    //       prev.score > current.score ? prev : current
    //     );

    //     // Return student name if available
    //     return top.studentId?.userId?.fullName || "N/A";
    //   },
    //   icon: <Crown size={18} />,
    // },
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
      accessorKey: "month",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>Month</span>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.month);
        const monthName = date.toLocaleString("default", { month: "long" });
        return <span>{monthName}</span>;
      },
    },
    {
      accessorKey: "batchName",
      header: () => (
        <div className="flex items-center gap-2">
          <Tag size={16} />
          <span>Batch</span>
        </div>
      ),
      cell: ({ row }) => {
        const batchName = row.original.batchId?.batch_Name;
        return <span className="font-medium">{batchName}</span>;
      },
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
      accessorKey: "topScorer",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <BarChart3 size={16} /> Top Scorer
        </div>
      ),
      cell: ({ row }) => {
        const marks = row.original.marks;
        if (!marks || marks.length === 0) return "N/A";

        const top = marks.reduce((prev, current) =>
          prev.score > current.score ? prev : current
        );

        return top.studentId?.userId?.fullName || "N/A";
      },
    },
    {
      accessorKey: "averageScore",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <BarChart3 size={16} /> Avg Score
        </div>
      ),
      cell: ({ row }) => {
        const marks = row.original.marks;
        if (!marks || marks.length === 0) return "0.00";

        const total = marks.reduce((sum, m) => sum + m.score, 0);
        const avg = total / marks.length;

        return avg.toFixed(2);
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarCheck size={16} /> Created At
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.createdAt),
    },
    {
      accessorKey: "view/edit Marks",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Eye size={16} />
          View/Edit Marks
        </div>
      ),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCreatedAssessment(
              allAssessments.find((a) => a._id === row.original._id)
            ),
              setEditAssessmentModal(true);
          }}
        >
          <Eye size={14} className="me-1" />
        </Button>
      ),
    },
    {
      accessorKey: "details",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Repeat2 size={16} /> Details
        </div>
      ),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRow(row.original), setViewModal(true);
          }}
        >
          <Repeat2 size={14} className="me-1" />
        </Button>
      ),
    },
  ];

  const assessmentFields = [
    { key: "title", label: "Assessment Title" },
    { key: "type", label: "Assessment Type" },
    {
      key: "batchId.batch_Name",
      label: "Batch Name",
    },
    {
      key: "batchId.batch_No",
      label: "Batch No",
    },
    {
      key: "marks.length",
      label: "Total Students Assessed",
    },
    {
      key: "createdAt",
      label: "Created At",
      type: "date",
    },
  ];

  const updateAssessmentMarks = async (data) => {
    const marks = data.map((mark) => ({
      studentId: mark.studentId,
      score: mark.marks,
      feedback: mark.feedback,
    }));
    const payLoad = {
      assessmentId: createdAssessment._id,
      marks,
    };

    console.log(payLoad);

    try {
      const response = await assessmentService.updateAssessmentMarks(payLoad);
      setCreatedAssessment(response.data || []);
      fetchAllAssessments(trainer);
      toast.success("Assessment Updated Successfully");
    } catch (error) {
      toast.error("Error in updateAssessmentMarks");
      console.error("Error in updateAssessmentMarks", error);
    }
  };

  return (
    <>
      <StatCard cards={assessmentStats} />

      <DataTable
        title="Assessments "
        data={allAssessments}
        columns={assessmentColumns}
      />

      <AssessmentFormModal
        show={editAssessmentModal}
        onClose={() => setEditAssessmentModal(false)}
        assessment={createdAssessment}
        onSave={(marks) => {
          updateAssessmentMarks(marks);
        }}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={assessmentFields}
        title={selectedRow?.title}
        data={selectedRow}
      />
    </>
  );
};

export default TrainerAssessmentsPage;
