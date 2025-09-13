import ReasonModal from "@/components/modals/ReasonModal";
import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import itepApplicantService from "@/services/itepApplicantService";
import projectService from "@/services/projectService";
import studentService from "@/services/studentService";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CheckCheck,
  ClipboardList,
  EqualApproximatelyIcon,
  File,
  Mail,
  Paperclip,
  Phone,
  School,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementDashboardPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [projects, setProjects] = useState([]);

  const [currMonthApplicants, setCurrMonthApplicants] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  //Fetch All
  const fetchAllCurrentMonthApplicants = async () => {
    try {
      const response = await itepApplicantService.getAll();
      const users = response.data || [];
      setCurrMonthApplicants(users.users);
    } catch (error) {
      toast.error("Error in fetchAllCurrentMonthApplicants");
      console.log("Error in fetchAllCurrentMonthApplicants", error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data || []);
    } catch (error) {
      toast.error("Error in fetchAllStudents");
      console.log("Error in fetchAllStudents", error);
    }
  };

  const fetchAllAssessments = async () => {
    try {
      const response = await assessmentService.getAllAssessments();
      setAssessments(response.data || []);
    } catch (error) {
      toast.error("Error in fetchAllAssessments");
      console.log("Error in fetchAllAssessments", error);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.data || []);
    } catch (error) {
      toast.error("Error in fetchAllProjects");
      console.log("Error in fetchAllProjects", error);
    }
  };

  const fetchAllApplicants = async () => {
    try {
      const response = await itepApplicantService.getAll();
      setApplicants(response.data || []);
    } catch (error) {
      toast.error("Error in Aplicants fetching");
      console.log("Error in Aplicants fetching", error);
    }
  };

  useEffect(() => {
    fetchAllCurrentMonthApplicants();
    fetchAllApplicants();
    fetchAllStudents();
    fetchAllAssessments();
    fetchAllProjects();
  }, []);

  //Stats data
  const managementStatCards = [
    {
      title: "Total Applicants",
      count: applicants.length,
      icon: <ClipboardList size={18} />,
    },
    {
      title: "Total Students",
      count: students.length,
      icon: <Users size={18} />,
    },

    {
      title: "Total Assessments",
      count: assessments.length,
      icon: <EqualApproximatelyIcon size={18} />,
    },
    {
      title: "Total Projects",
      count: projects.length,
      icon: <File size={18} />,
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
      <StatCard cards={managementStatCards} />
      {/* <BatchAssessmentChart /> */}

      <DataTable
        title="Current Month ITEP Registrations"
        data={currMonthApplicants}
        columns={columns}
        // showSelection={true}
        // approveButton={true}
        // rejectButton={true}
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
    </>
  );
};

export default ManagementDashboardPage;
