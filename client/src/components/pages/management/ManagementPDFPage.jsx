import ConfirmModal from "@/components/modals/ConfirmModal";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import pdfService from "@/services/pdfService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  CalendarCheck,
  Eye,
  FileCode2,
  Link2Icon,
  TargetIcon,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementPDFPage = () => {
  const user = useAuth().user;
  const [allPDF, setAllPDF] = useState([]);

  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  // console.log(useUser());

  const fetchAllPDFs = async () => {
    try {
      const response = await pdfService.getAllPDFs();
      setAllPDF(response.data || []);
    } catch (error) {
      toast.error("Error in fetching fetchAllPDFs");
      console.log("Error in fetching fetchAllPDFs", error);
    }
  };

  useEffect(() => {
    fetchAllPDFs();
  }, []);

  //Stats data
  const projectStatCards = [
    {
      title: "Total PDF",
      count: allPDF.length,
      icon: <FileCode2 size={18} />,
    },
  ];

  const PDFsColumns = [
    {
      accessorKey: "title",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Title
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.title}</span>;
      },
    },
    {
      accessorKey: "fileType",
      header: () => (
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Type</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.fileType}</span>;
      },
    },
    {
      accessorKey: "targetBatches ",
      header: () => (
        <div className="flex items-center gap-2">
          <TargetIcon size={16} />
          <span>Target batches</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.original.targetBatchIds?.map((b) => b.batch_Name + " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "uploadedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarCheck size={16} /> Uploaded On
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.uploadedOn),
    },
    {
      accessorKey: "uploadedBy",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Uploaded By
        </div>
      ),
      cell: ({ row }) => <span>{row.original.uploadedBy.userId.fullName}</span>,
    },
    {
      accessorKey: "fileLink",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Link2Icon size={16} /> Open
        </div>
      ),
      cell: ({ row }) => (
        <a target="_blank" href={row.original.fileLink?.secure_id}>
          <Eye size={18} />
        </a>
      ),
    },
  ];

  const deletePDFs = async (rows) => {
    setSelectedRow(null);
    const ids = rows.map((row) => row._id);
    const payLoad = {
      ids: ids,
    };
    try {
      // await pdfService.deletePDFsByIds(payLoad);
      toast.warn("Currently It is disabled");
    } catch (error) {
      console.log("Erorr in deletePDFs", error);
      toast.error("Error in deletePDFs");
    } finally {
      setDeleteModal(false);
      setSelectedRow(null);
      fetchAllPDFs();
    }
  };

  return (
    <>
      <StatCard cards={projectStatCards} />

      <DataTable
        title="All PDF "
        data={allPDF}
        columns={PDFsColumns}
        showSelection={true}
        deleteButton={true}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
      />
      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected PDFs"}
        onConfirm={() => {
          deletePDFs(selectedRow);
          setDeleteModal(false), setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />
    </>
  );
};

export default ManagementPDFPage;
