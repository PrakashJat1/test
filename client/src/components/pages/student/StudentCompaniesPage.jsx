import ViewModal from "@/components/modals/ViewModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import companyService from "@/services/companyService";
import studentService from "@/services/studentService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  CalendarDays,
  DollarSignIcon,
  Eye,
  File,
  FileText,
  Link,
  LinkIcon,
  User,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const StudentCompaniesPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);

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

  const fetchCompanies = async (id) => {
    if (id !== undefined)
      try {
        const response = await companyService.getAllByBatchId(id);
        const company = response.data ||  []
        setCompanies(
          company.sort(
            (a, b) => new Date(b.driveDate) - new Date(a.driveDate)
          )
        );
      } catch (error) {
        if (error && error.response.status === 404) {
          toast.warn("Companies are not found");
        } else toast.error("Error in fetchCompanies");

        console.log("Error in  fetchCompanies", error);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchCompanies();
        if (student?.assigned_batch?._id)
          await fetchCompanies(student?.assigned_batch?._id);
      }
    };

    fetchData();
  }, []);

  function getUpcomingDrive(currentBatchId) {
    const now = new Date();
    const upcoming = companies
      .filter(
        (s) =>
          new Date(s.driveDate) > now &&
          s.batchIds.some((batch) =>
            typeof batch === "object"
              ? batch._id == currentBatchId
              : batch == currentBatchId
          )
      )
      .sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate))[0];

    return upcoming || null;
  }

  const nextDrive = useMemo(() => {
    if (student?.assigned_batch?._id) {
      return getUpcomingDrive(student.assigned_batch._id);
    }
    return null;
  }, [companies?.length, student?._id]);

  //Stats data
  const statCards = [
    {
      title: " Total ",
      count: companies?.length,
      icon: <DollarSignIcon size={18} />,
    },
    {
      title: "Upcoming Drive",
      count:
        dateFormatter(nextDrive?.driveDate) !== "Invalid Date"
          ? dateFormatter(nextDrive?.driveDate)
          : "-",
      icon: <CalendarDays size={18} />,
    },
  ];

  const companyColumns = [
    {
      accessorKey: "name",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Name
        </div>
      ),
    },
    {
      accessorKey: "roleOffered",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Role
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-capitalize">{row.original.roleOffered}</span>
      ),
    },
    {
      accessorKey: "package",
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSignIcon size={16} />
          <span>Package</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">{row.original.packageOffered}</span>
        );
      },
    },
    {
      accessorKey: "driveDate",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{dateFormatter(row.original.driveDate)}</span>;
      },
    },
    {
      accessorKey: "websiteLink",
      header: () => (
        <div className="flex items-center gap-2">
          <Link size={16} />
          <span>Website Link</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <a
            href={row.original.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon size={18} className="text-blue-500 hover:underline" />
          </a>
        );
      },
    },
    {
      accessorKey: "details",
      header: () => (
        <div className="flex items-center gap-2">
          <File size={16} />
          <span>Details</span>
        </div>
      ),
      cell: ({ row }) => (
        <Eye
          size={18}
          onClick={() => {
            setSelectedRow(row.original), setViewModal(true);
          }}
        />
      ),
    },
  ];

  const companiesFields = [
    { key: "name", label: "Company Name" },
    { key: "uploadedBy.fullName", label: "Added by" },
    {
      key: "driveDate",
      label: "Drive Date",
      type: "date",
    },
    {
      key: "roleOffered",
      label: "Role Offered",
    },
    {
      key: "packageOffered",
      label: "Package Offered",
    },
    {
      key: "websiteLink",
      label: "Website Link",
      type: "link",
    },
    {
      key: "roundsInfo",
      label: "Rounds Info",
    },
  ];

  return (
    <>
      {student && <StatCard cards={statCards} />}
      {student && (
        <DataTable
          title=" All Companies Drives "
          data={companies}
          columns={companyColumns}
        />
      )}

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={companiesFields}
        title={selectedRow?.name}
        data={selectedRow}
      />
    </>
  );
};

export default StudentCompaniesPage;
