import ConfirmModal from "@/components/modals/ConfirmModal";
import ReasonModal from "@/components/modals/ReasonModal";
import ViewModal from "@/components/modals/ViewModal";
import BatchAssessmentChart from "@/components/pages/admin/BatchAssessmentChart";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import itepApplicantService from "@/services/itepApplicantService";
import userService from "@/services/userService";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CheckCheck,
  CheckCircle,
  ClipboardList,
  Mail,
  Paperclip,
  Phone,
  School,
  ShieldCheck,
  User,
  User2,
  Users,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  //Fetch All Users and current month registrations
  const fetchAllUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error("Error in users fetching");
      console.log("Error in users fetching", error);
    }
  };

  const fetchAllApplicants = async () => {
    try {
      const response =
        await itepApplicantService.getAllCurrentMonthApplicants();
      setApplicants(response.data || []);
    } catch (error) {
      toast.error("Error in Aplicants fetching");
      console.log("Error in Aplicants fetching", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllApplicants();
  }, []);

  //Stats data
  const adminStatCards = [
    { title: "Total Users", count: users.length, icon: <Users size={18} /> },
    {
      title: "Applicants",
      count: applicants.length,
      icon: <ClipboardList size={18} />,
    },
    {
      title: "Pending Users",
      count: users.filter((user) => !user.status).length,
      icon: <User2 size={18} />,
    },
    {
      title: "Active Users",
      count: users.filter((user) => user.status).length,
      icon: <ShieldCheck size={18} />,
    },
  ];

  //Table
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fullName", {
      id: "fullName",
      header: () => (
        <span className="flex text-center">
          <User size={18} /> Name
        </span>
      ),
    }),

    columnHelper.accessor("email", {
      id: "email",
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex text-center">
          <Mail size={18} /> Mail
        </span>
      ),
    }),

    columnHelper.accessor("mobileNo", {
      id: "mobileNo",
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex text-center">
          <Phone size={18} /> Phone
        </span>
      ),
    }),

    columnHelper.accessor("college", {
      id: "college",
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex text-center">
          <School size={18} /> College
        </span>
      ),
    }),

    columnHelper.accessor("qualification", {
      id: "qualification",
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex text-center">
          <School size={18} /> Qualification
        </span>
      ),
    }),

    columnHelper.accessor("isverified", {
      id: "isVerified",
      header: "Verified?",
      enableGrouping: true,
      cell: (info) => (
        <div className="text-center w-100">
          {info.getValue() ? (
            <CheckCheck size={20} color="green" />
          ) : (
            <ShieldCheck size={20} color="red" />
          )}
        </div>
      ),
    }),

    // columnHelper.accessor("examAllowed", {
    //   id: "examAllowed",
    //   header: "examAllowed?",
    //   cell: (info) => (
    //     <div className="text-center w-100">
    //       {info.getValue() ? (
    //         <CheckCircle size={20} color="green" />
    //       ) : (
    //         <XCircle size={20} color="red" />
    //       )}
    //     </div>
    //   ),
    // }),

    columnHelper.accessor("details", {
      id: "details",
      cell: (info) => (
        <div className="text-center w-100">
          <button
            className="btn btn-sm btn-outline-primary m-1"
            onClick={() => {
              setSelectedRow(info.row.original), setViewModal(true);
            }}
          >
            View
          </button>
        </div>
      ),
      header: () => (
        <span className="d-flex align-items-center gap-1">
          <Paperclip size={18} /> Details
        </span>
      ),
    }),
  ];

  //View Modal Fields
  const fields = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "mobileNo", label: "Mobile Number" },
    { key: "gender", label: "Gender" },
    { key: "maritalStatus", label: "Marital Status" },
    { key: "DOB", label: "Date of Birth", type: "date" },
    { key: "qualification", label: "Qualification" },
    { key: "graduationCompletionYear", label: "Graduation Year" },
    { key: "college", label: "College" },
    { key: "preferredCity", label: "Preferred City" },
    { key: "state", label: "State" },
    { key: "familyAnnualIncome", label: "Family Income" },
    { key: "fatherFullName", label: "Father's Name" },
    { key: "fromWhereYouFindAboutITEP", label: "Found ITEP Through" },
    { key: "localAddress", label: "Local Address" },
    { key: "permanentAddress", label: "Permanent Address" },
    { key: "examAllowed", label: "Allowed for Exam", type: "boolean" },
    { key: "status", label: "Exam Status" },
    { key: "appliedOn", label: "Applied On", type: "datetime" },

    // For photo
    { key: "photo.secure_url", label: "Photo", type: "image" },

    // For document PDFs
    {
      key: "documentsPDF.secure_url",
      label: "Submitted Documents",
      type: "pdf",
    },
    {
      key: "fatherIncomeCerificate.secure_url",
      label: "Father's Income Certificate",
      type: "pdf",
    },
  ];

  const approveApplicants = async (rows) => {
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
      examAllowed: true,
      reason: "Best of Luck for Upcoming Exam and be prepared 😊",
    };
    try {
      await itepApplicantService.updateApplicantsStatusForExamById(data);
      fetchAllApplicants();
      toast.success("Approved");
    } catch (error) {
      console.log("Erorr in approveApplicants", error);
      toast.error("Error in approveApplicants");
    }
  };

  const rejectApplicants = async (rows, reason) => {
    setSelectedRow(null);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
      examAllowed: false,
      reason,
    };
    try {
      await itepApplicantService.updateApplicantsStatusForExamById(data);
      fetchAllApplicants();
      toast.success("rejected");
    } catch (error) {
      console.log("Erorr in rejectApplicants", error);
      toast.error("Error in rejectApplicants");
    }
  };

  const deleteApplicants = async (rows) => {
    setSelectedRow(null);
    const ids = rows.map((row) => row._id);

    try {
      // await itepApplicantService.deleteApplicantsById(ids);
      fetchAllApplicants();
      toast.success("Currently It is disabled");
    } catch (error) {
      console.log("Erorr in deleteApplicants", error);
      toast.error("Error in deleteApplicants");
    }
  };

  return (
    <>
      <StatCard cards={adminStatCards} />
      {/* <BatchAssessmentChart/> */}

      <DataTable
        title="Current Month ITEP Registrations"
        data={applicants}
        columns={columns}
        // showSelection={true}
        deleteButton={true}
        // approveButton={true}
        // rejectButton={true}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
        // onApprove={(rows) => approveApplicants(rows)}
        // onReject={(rows) => {
        //   setSelectedRow(rows), setRejectModal(true);
        // }}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={fields}
        title={selectedRow?.userId?.fullName}
        data={selectedRow}
      />

      {/* Reason Modal */}
      <ReasonModal
        show={rejectModal}
        onClose={() => {
          setRejectModal(false), setSelectedRow(null);
        }}
        onReject={(reason) => {
          rejectApplicants(selectedRow, reason);
        }}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected applicants"}
        onConfirm={() => {
          deleteApplicants(selectedRow);
          setDeleteModal(false), setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />
    </>
  );
};

export default DashboardPage;
