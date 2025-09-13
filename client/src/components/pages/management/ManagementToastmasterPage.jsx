import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import toastmasterService from "@/services/toastmasterService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  Award,
  LucideTimerReset,
  Mic,
  Users,
  ArrowUpDown,
  Eye,
  Calendar,
  BookOpen,
  SpellCheck,
  Quote,
  User,
  GraduationCap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementToastmasterPage = () => {
  const [allToastMaster, setAllToastMaster] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const mostActiveSpeaker = () => {
    const [mostActiveSpeakerId, maxCount] = Object.entries(
      allToastMaster
        .flatMap((tm) => tm.roles || [])
        .reduce((acc, { student }) => {
          const id = student?._id?.toString();
          if (id) acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {})
    ).reduce((max, entry) => (entry[1] > max[1] ? entry : max), [null, 0]);

    const studentObj = allToastMaster
      .flatMap((tm) => tm.roles || [])
      .find((r) => r.student?._id?.toString() === mostActiveSpeakerId)?.student;

    const studentName = studentObj?.userId?.fullName || "Unknown";

    return `${studentName} (${maxCount})`;
  };

  const toastMasterStats = [
    {
      title: "Total Assessments",
      count: allToastMaster.length,
      icon: <Mic size={18} />,
    },
    {
      title: "Current Month",
      count: allToastMaster.filter((tm) => {
        const sessionDate = new Date(tm.date);
        return (
          sessionDate.getMonth() === new Date().getMonth() &&
          sessionDate.getFullYear() === new Date().getFullYear()
        );
      }).length,
      icon: <LucideTimerReset size={18} />,
    },
    {
      title: "Active Speaker",
      count: mostActiveSpeaker(),
      icon: <Award size={18} />,
    },
  ];

  const toastMasterColumns = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer d-flex align-items-center gap-1"
        >
          <Calendar size={18} /> Date <ArrowUpDown size={16} />
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.date),
    },
    {
      accessorKey: "theme",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <BookOpen size={18} /> Theme
        </div>
      ),
    },
    {
      accessorKey: "wordOfDay",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <SpellCheck size={18} /> Word
        </div>
      ),
    },
    {
      accessorKey: "idiom",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Quote size={18} /> Idiom
        </div>
      ),
    },
    {
      accessorKey: "hostedBy.fullName",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={18} /> Hosted By
        </div>
      ),
      cell: ({ row }) => row.original.hostedBy?.fullName || "N/A",
    },
    {
      accessorKey: "batch.batch_Name",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <GraduationCap size={18} /> Batch
        </div>
      ),
      cell: ({ row }) => row.original.batch?.batch_Name || "N/A",
    },
    {
      id: "roles",
      header: () => (
        <div className="d-flex align-items-center gap-1 justify-content-center">
          <Users size={18} /> Roles
        </div>
      ),
      cell: ({ row }) => (
        <div className="d-flex justify-content-center">
          <Eye
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => {
              setSelectedRow(row.original), setViewModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const fetchAllToastMasters = async () => {
    try {
      const response = await toastmasterService.getAll();
      setAllToastMaster(response.data || []);
    } catch (error) {
      toast.error("Error in fetching allAssessments");
      console.log("Error in fetching allAssessments", error);
    }
  };

  useEffect(() => {
    fetchAllToastMasters();
  }, []);

  return (
    <>
      <StatCard cards={toastMasterStats} />

      <DataTable
        title=" Toastmaster Sessions "
        data={allToastMaster}
        columns={toastMasterColumns}
      />

      {/* View  Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={
          selectedRow?.roles?.map((s, index) => ({
            key: `roles.${index}.role`,
            label: s?.student?.userId?.fullName,
          })) || []
        }
        title={selectedRow?.theme}
        data={selectedRow}
      />
    </>
  );
};

export default ManagementToastmasterPage;
