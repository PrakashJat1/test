import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  CalendarDays,
  Code2,
  Eye,
  FileText,
  FlaskConical,
  Repeat2,
  Tag,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ManagementAssessmentPage = () => {
  const [allAssessments, setAllAssessments] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewMarksModal, setViewMarksModal] = useState(false);

  const assessmentStats = [
    {
      title: "Total Assessments",
      count: allAssessments.length,
      icon: <FileText size={18} />,
    },
    {
      title: "Technical",
      count: allAssessments.filter(
        (a) => a.createdBy?.type_Of_Trainer === "technical"
      ).length,
      icon: <Code2 size={18} />,
    },
    {
      title: "Softskill",
      count: allAssessments.filter(
        (a) => a.createdBy?.type_Of_Trainer === "softskill"
      ).length,
      icon: <BookOpen size={18} />,
    },
    {
      title: "Aptitude",
      count: allAssessments.filter(
        (a) => a.createdBy?.type_Of_Trainer === "aptitude"
      ).length,
      icon: <Brain size={18} />,
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
        const batchName = row.original.batchId.batch_Name;
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
      accessorKey: "viewMarks",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Eye size={16} /> Marks
        </div>
      ),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRow(row.original), setViewMarksModal(true);
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
      key: "month",
      label: "Assessment Month",
      type: "date",
    },
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

  const fetchAllAssessments = async () => {
    try {
      const response = await assessmentService.getAllAssessments();
      setAllAssessments(response.data || []);
    } catch (error) {
      toast.error("Error in fetching allAssessments");
      console.log("Error in fetching allAssessments", error);
    }
  };

  useEffect(() => {
    fetchAllAssessments();
  }, []);

  return (
    <>
      <StatCard cards={assessmentStats} />

      <DataTable
        title=" Assessments "
        data={allAssessments}
        columns={assessmentColumns}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={assessmentFields}
        title={selectedRow?.title}
        data={selectedRow}
      />

      {/* View Marks Modal */}
      <ViewModal
        show={viewMarksModal}
        onClose={() => setViewMarksModal(false)}
        fields={
          selectedRow?.marks?.map((mark, index) => ({
            key: `marks.${index}.score`,
            label: mark?.studentId?.userId?.fullName,
          })) || []
        }
        title={selectedRow?.title}
        data={selectedRow}
      />
    </>
  );
};

export default ManagementAssessmentPage;
