import FormWrapper from "@/components/common/Form/FormWrapper";
import RadioGroupField from "@/components/common/Form/RadioGroupField";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import ConfirmModal from "@/components/modals/ConfirmModal";
import FormModal from "@/components/modals/FormModal";
import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import batchService from "@/services/batchService";
import studentService from "@/services/studentService";
import userService from "@/services/userService";
import yupSchemas from "@/utils/yupSchemas";
import {
  User,
  Mail,
  BadgeCheck,
  Layers3,
  FileText,
  GraduationCap,
  UserCheck,
  UserPlus,
  UserX,
  Ban,
  Loader2,
  CheckCircle2,
  XCircle,
  Hourglass,
  Paperclip,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [allAssessments, setAllAssessments] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // for view
  const [selectedRow, setSelectedRow] = useState([]); //for actions

  const [placementStatusModal, setPlacementStatusModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [assignBatchModal, setAssignBatchModal] = useState(false);

  const fetchAllStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data || []);
      getAllAssessments();
    } catch (error) {
      toast.error("Error in fetching students");
      console.log("Error in fetching students", error);
    }
  };

  const getAllAssessments = async () => {
    try {
      const response = await assessmentService.getAllAssessments();
      const assessments = response.data || [];

      setAllAssessments(assessments);

      // Enrich students after setting assessments
      setStudents((prevStudents) => {
        // Sort assessments by month descending
        const sortedAssessments = [...assessments].sort(
          (a, b) => new Date(b.month) - new Date(a.month)
        );

        // Map through each student to assign lastAssessmentScore
        const enrichedStudents = prevStudents.map((student) => {
          const studentId = student._id;

          for (let assessment of sortedAssessments) {
            const markEntry = assessment.marks.find(
              (mark) => mark.studentId._id === studentId
            );

            if (markEntry) {
              return {
                ...student,
                lastAssessmentScore: markEntry.score, // you can add more fields like feedback
              };
            }
          }

          return {
            ...student,
            lastAssessmentScore: null, // if no score found
          };
        });

        return enrichedStudents;
      });
    } catch (error) {
      toast.error("Error in fetching getAllAssessments");
      console.log("Error in fetching getAllAssessments", error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      setBatches(response.data || []);
    } catch (error) {
      toast.error("Error in batch fetching");
      console.log("Error in batch fetching", error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
    fetchAllBatches();
  }, []);

  const studentStats = [
    {
      title: "Total Students",
      count: students.length,
      icon: <GraduationCap size={25} />,
    },
    {
      title: "New Student",
      count: students.filter(({ createdAt }) => {
        const date = new Date(createdAt);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: <UserPlus size={25} />,
    },
    {
      title: "Active Students",
      count: students.filter((student) => student?.userId?.status).length,
      icon: <UserCheck size={25} />,
    },
    {
      title: "Blocked Students",
      count: students.filter((student) => !student?.userId?.status).length,
      icon: <UserX size={25} />,
    },
  ];

  const columns = [
    {
      accessorKey: "userId.fullName",
      header: () => (
        <span>
          <User className="me-1" size={16} /> Name
        </span>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "userId.email",
      header: () => (
        <span>
          <Mail className="me-1" size={16} /> Email
        </span>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "enrollmentId",
      header: () => (
        <span>
          <BadgeCheck className="me-1" size={16} /> Enrollment ID
        </span>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "assigned_batch.batch_Name",
      header: () => (
        <span>
          <Layers3 className="me-1" size={16} /> Batch Name
        </span>
      ),
      cell: ({ row }) => {
        const student = row.original;
        const currentBatchName =
          student?.assigned_batch?.batch_Name ?? "Not Assigned";

        return (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <span className="text-nowrap">{currentBatchName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "lastAssessmentScore",
      header: () => (
        <span>
          <FileText className="me-1" size={16} /> Last Assessment Score
        </span>
      ),
      cell: (info) => `${info.getValue()} / 100`,
    },
    {
      accessorKey: "placementStatus",
      header: () => (
        <span>
          <BadgeCheck className="me-1" size={16} /> Placement Status
        </span>
      ),
      cell: (info) => {
        const value = info.getValue();
        if (value === "selected")
          return (
            <div className="d-flex justify-content-center align-items-center text-success">
              <CheckCircle2 size={20} />
            </div>
          );
        if (value === "rejected")
          return (
            <div className="d-flex justify-content-center align-items-center text-danger">
              <XCircle size={20} />
            </div>
          );
        return (
          <div className="d-flex justify-content-center align-items-center text-warning">
            <Hourglass size={20} />
          </div>
        );
      },
    },
    {
      accessorKey: "userId.status",
      header: () => (
        <span>
          <Loader2 className="me-1" size={16} /> Account Status
        </span>
      ),
      cell: (info) => {
        const value = info.getValue();
        return value === true ? (
          <div className="d-flex justify-content-center align-items-center text-success">
            <CheckCircle2 size={20} />
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center text-danger">
            <Ban size={20} />
          </div>
        );
      },
    },
    {
      accessorKey: "details",
      header: () => (
        <span className="d-flex align-items-center gap-1">
          <Paperclip size={18} /> Details
        </span>
      ),
      cell: (info) => (
        <div className="text-center w-100">
          <button
            className="btn btn-sm btn-outline-primary m-1"
            onClick={() => {
              setSelectedStudent(info.row.original), setViewModal(true);
            }}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const fields = [
    { key: "userId.fullName", label: "Full Name" },
    { key: "userId.email", label: "Email" },
    { key: "enrollmentId", label: "Enrollment ID" },
    { key: "assigned_batch.batch_Name", label: "Batch Name" },
    { key: "fatherFullName", label: "Father's Name" },
    { key: "userId.mobileNo", label: "Mobile Number" },
    { key: "DOB", label: "Date of Birth", type: "date" },
    { key: "gender", label: "Gender" },
    { key: "maritalStatus", label: "Marital Status" },
    { key: "localAddress", label: "Local Address" },
    { key: "permanentAddress", label: "Permanent Address" },
    { key: "state", label: "State" },
    { key: "college", label: "College" },
    { key: "qualification", label: "Qualification" },
    { key: "graduationCompletionYear", label: "Graduation Year" },
    { key: "familyAnnualIncome", label: "Family Annual Income" },
    { key: "preferredCity", label: "Preferred City" },
    { key: "placementStatus", label: "Placement Status" },
    { key: "userId.status", label: "Account Status", type: "boolean" },
    { key: "userId.isVerified", label: "Verified", type: "boolean" },
    { key: "createdOn", label: "Registered On", type: "date" },
    {
      key: "lastAssessmentScore",
      label: "Last Assessment Score",
    },
  ];

  const activeStudentsAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row.userId._id);
    const data = {
      ids,
      status: true,
    };
    try {
      await userService.updateUserStatusById(data);
      fetchAllStudents();
      toast.success("Users Activated");
    } catch (error) {
      console.log("Erorr in activeStudentsAccount", error);
      toast.error("Error in activeStudentsAccount");
    }
  };

  const suspendStudentsAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row.userId._id);
    const data = {
      ids,
      status: false,
    };
    try {
      await userService.updateUserStatusById(data);
      fetchAllStudents();
      toast.success("Users Suspended");
    } catch (error) {
      console.log("Erorr in suspendStudentsAccount", error);
      toast.error("Error in suspendStudentsAccount");
    }
  };

  const deleteStudentsAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row.userId._id);
    const data = {
      ids,
    };
    try {
      await userService.deleteUserById(data);
      fetchAllStudents();
      toast.success("Students deleted successfully");
    } catch (error) {
      console.log("Erorr in deleteStudents", error);
      toast.error("Error in deleteStudents");
    }
  };

  const handleAssignBatch = async (data) => {
    try {
      const payLoad = {
        studentsIds: selectedRow.map((student) => student._id),
        batchId: data.assigned_Batch,
      };

      console.log(payLoad);
      await studentService.assignBatch(payLoad);
      toast.success("Batches assigned successfully");
      fetchAllStudents();
      setSelectedRow(null);
      setAssignBatchModal(false);
    } catch (error) {
      toast.error("Error in handleAssignBatch to Student");
      console.log("Error in handleAssignBatch to Student", error);
    }
  };

  const BatchAssignedFORM = () => (
    <FormWrapper
      defaultValues={{
        assigned_Batch: "",
      }}
      onSubmit={handleAssignBatch}
      schema={yupSchemas.assignBatchtoStudentSchema}
    >
      <RadioGroupField
        name="assigned_Batch"
        label="Batches"
        options={batches.map((batch) => ({
          label: batch.batch_Name,
          value: batch._id,
        }))}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAssignBatchModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const handlePlacementStatus = async (data) => {
    try {
      const payLoad = {
        studentsIds: selectedRow.map((student) => student._id),
        placementStatus: data.placementStatus,
      };

      console.log(payLoad);
      await studentService.updateStudentPlacementStatusByIds(payLoad);
      toast.success("Placement Status updated");
    } catch (error) {
      toast.error("Error in handlePlacementStatus of Student");
      console.log("Error in handlePlacementStatus of Student", error);
    } finally {
      fetchAllStudents();
      setSelectedRow(null);
      setPlacementStatusModal(false);
    }
  };

  const PlacementStatusFORM = () => (
    <FormWrapper
      defaultValues={{
        placementStatus: "",
      }}
      onSubmit={handlePlacementStatus}
      schema={yupSchemas.placementStatusSchema}
    >
      <SelectField
        name="placementStatus"
        label="Select Status"
        options={[
          { label: "Selected", value: "selected" },
          { label: "Pending", value: "pending" },
          { label: "Rejected", value: "rejected" },
        ]}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update" />
        <button
          className="btn btn-secondary"
          onClick={() => setPlacementStatusModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      <StatCard cards={studentStats} />
      <DataTable
        title=" All Students "
        data={students}
        columns={columns}
        showSelection={true}
        deleteButton={true}
        activeButton={true}
        suspendButton={true}
        assignBatchButton={true}
        placementButton={true}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
        onActive={(rows) => activeStudentsAccount(rows)}
        onSuspend={(rows) => suspendStudentsAccount(rows)}
        onAssignBatch={(rows) => {
          setSelectedRow(rows), setAssignBatchModal(true);
        }}
        onPlacementUpdate={(rows) => {
          setSelectedRow(rows), setPlacementStatusModal(true);
        }}
      />
      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={fields}
        title={selectedStudent?.userId?.fullName}
        data={selectedStudent}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected Students"}
        onConfirm={() => {
          deleteStudentsAccount(selectedRow);
          setDeleteModal(false), setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />

      <FormModal
        title={`Assign Other Batch to ${selectedStudent?.userId?.fullName}`}
        show={assignBatchModal}
        onClose={() => setAssignBatchModal(false)}
        formWrapper={<BatchAssignedFORM />}
      />
    </>
  );
};

export default StudentPage;
