import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import pdfService from "@/services/pdfService";
import studentService from "@/services/studentService";
import timetableService from "@/services/timetableService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  ArrowUpDown,
  User,
  Timer,
  File,
  IdCard,
  BadgeCheckIcon,
  EyeIcon,
  TimerIcon,
  Pencil,
  FileCode2,
  Users,
  Link2Icon,
  Eye,
  CalendarCheck,
  FileText,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentDocumentsPage = () => {
  const user = useAuth().user;
  const [student, setStudent] = useState(null);
  const [allTimebables, setAllTimebables] = useState([]);
  const [allPDF, setAllPDF] = useState([]);

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

  const fetchAllTimetables = async (id) => {
    try {
      const response = await timetableService.getAllByStudentId(id);
      setAllTimebables(response.data || []);
    } catch (error) {
      if (error && error.response.status !== 409)
        toast.error("Error in fetching AllTimetables");
      console.log("Error in fetching AllTimetables", error);
    }
  };

  const fetchAllPDFs = async (id) => {
    try {
      const response = await pdfService.getAllPDFByStudentId(id);
      setAllPDF(response.data || []);
    } catch (error) {
      toast.error("Error in fetching fetchAllPDFs");
      console.log("Error in fetching fetchAllPDFs", error);
    }
  };

  const studentDocStats = [
    {
      title: "Total TimeTables",
      count: allTimebables?.length,
      icon: <Timer size={18} />,
    },
    {
      title: "Total PDF",
      count: allPDF.length,
      icon: <FileCode2 size={18} />,
    },
  ];

  const timetableColumns = [
    {
      accessorKey: "Name",
      header: ({ column }) => (
        <div
          className="d-flex align-items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <IdCard size={18} /> Name <ArrowUpDown size={16} />
        </div>
      ),
    },
    {
      accessorKey: "batchId",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <BadgeCheckIcon size={18} /> Batch
        </div>
      ),
      cell: ({ row }) => <span>{row.original.batchId.batch_Name}</span>,
    },

    {
      accessorKey: "uploadedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <TimerIcon size={18} /> Uploaded On
        </div>
      ),
      cell: ({ row }) => <span>{dateFormatter(row.original.uploadedOn)}</span>,
    },
    {
      accessorKey: "uploadedBy",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={18} /> Uploaded By
        </div>
      ),
      cell: ({ row }) => <span>{row.original.uploadedBy.fullName}</span>,
    },
    {
      accessorKey: "file",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <File size={18} /> Open
        </div>
      ),
      cell: ({ row }) => (
        <a href={row.original.file.secure_id} target="_blank">
          <EyeIcon size={16} />
        </a>
      ),
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
          <FileText size={16} />
          <span>Type</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.fileType}</span>;
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

  useEffect(() => {
    const fecthData = async () => {
      const student = await fetchStudent();

      if (student) {
        await fetchAllTimetables(student?._id);
        await fetchAllPDFs(student?._id);
      }
    };
    fecthData();
  }, []);

  return (
    <>
      <StatCard cards={studentDocStats} />

      <DataTable
        title=" All Timetables "
        data={allTimebables}
        columns={timetableColumns}
      />
      <DataTable title=" All PDF " data={allPDF} columns={PDFsColumns} />
    </>
  );
};

export default StudentDocumentsPage;
