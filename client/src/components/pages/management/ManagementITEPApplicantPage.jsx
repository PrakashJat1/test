import FormWrapper from "@/components/common/Form/FormWrapper";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import ReasonModal from "@/components/modals/ReasonModal";
import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import batchService from "@/services/batchService";
import itepApplicantService from "@/services/itepApplicantService";
import yupSchemas from "@/utils/yupSchemas";
import { createColumnHelper } from "@tanstack/react-table";
import {
  BadgeCheck,
  CheckCheck,
  CheckCircle2,
  Clock,
  FileSignature,
  Hourglass,
  Mail,
  Paperclip,
  Phone,
  School,
  ShieldCheck,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementITEPApplicantPage = () => {
  const [batches, setBatches] = useState([]);
  const [itepApplicants, setItepApplicants] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [finalSelectionModal, setFinalSelectionModal] = useState(false);
  const [selectedBatchForApplicantsModal, setSelectedBatchForApplicantsModal] =
    useState(false);
  const fetchAllApplicants = async () => {
    try {
      const response = await itepApplicantService.getAll();
      setItepApplicants(response.data || []);
    } catch (error) {
      toast.error("Error in fetching applicants");
      console.log("Error in fetching applicants", error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      const batches = response.data || [];
      const unCompletedBatches = batches
        .filter((batch) => batch.status !== "completed")
        .map((batch) => ({
          label: batch.batch_Name,
          value: batch._id,
        }));
      setBatches(unCompletedBatches);
    } catch (error) {
      toast.error("Error in AllBatches fetching");
      console.log("Error in AllBatches fetching", error);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
    fetchAllBatches();
  }, []);

  const itepApplicantStats = [
    {
      title: "Total Applicants",
      count: itepApplicants.length,
      icon: <FileSignature size={20} />,
    },
    {
      title: "Pending for Exam",
      count: itepApplicants.filter((applicant) => !applicant.examAllowed)
        .length,
      icon: <Clock size={20} />,
    },
    {
      title: "Allowed for Exam",
      count: itepApplicants.filter((applicant) => applicant.examAllowed).length,
      icon: <CheckCircle2 size={20} />,
    },
    {
      title: "Selected Applicants",
      count: itepApplicants.filter(
        (applicant) => applicant.status === "selected"
      ).length,
      icon: <UserCheck size={20} />,
    },
  ];

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
    {
      accessorKey: "status",
      header: () => (
        <span>
          <BadgeCheck className="me-1" size={16} /> Selection Status
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

  const handleFinalSelectionOnSelected = async (data) => {
    try {
      const payLoad = {
        ids: selectedRow.map((student) => student._id),
        status: "selected",
        batchId: data.batchId,
      };
      await itepApplicantService.updateApplicantsStatusForSelectionByIds(
        payLoad
      );
      toast.success(`Applicants ${data.status}`);
    } catch (error) {
      toast.error("Error in handleFinalSelection of applicants");
      console.log("Error in handleFinalSelection of applicants", error);
    } finally {
      fetchAllApplicants();
      setSelectedRow(null);
      setSelectedBatchForApplicantsModal(false);
    }
  };

  const handleFinalSelectionOnPendingOrRejected = async (data) => {
    try {
      const payLoad = {
        ids: selectedRow.map((student) => student._id),
        status: data.status,
        batchId: "",
      };
      await itepApplicantService.updateApplicantsStatusForSelectionByIds(
        payLoad
      );
      toast.success(`Applicants ${data.status}`);
    } catch (error) {
      toast.error("Error in handleFinalSelection of applicants");
      console.log("Error in handleFinalSelection of applicants", error);
    } finally {
      fetchAllApplicants();
      setSelectedRow(null);
      setFinalSelectionModal(false);
    }
  };

  const FinalSelectionFORM = () => (
    <FormWrapper
      defaultValues={{
        placementStatus: "",
      }}
      onSubmit={(data) => {
        if (data.status === "selected") {
          setFinalSelectionModal(false);
          setSelectedBatchForApplicantsModal(true);
        } else {
          handleFinalSelectionOnPendingOrRejected(data);
        }
      }}
      schema={yupSchemas.finalSelectionStatusSchema}
    >
      <SelectField
        name="status"
        label="Select Final Selection Status"
        options={[
          { label: "Selected", value: "selected" },
          { label: "Rejected", value: "rejected" },
          { label: "Pending", value: "pending" },
        ]}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update" />
        <button
          className="btn btn-secondary"
          onClick={() => setFinalSelectionModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const ChooseBatchFORM = () => (
    <FormWrapper
      defaultValues={{
        batchId: "",
      }}
      onSubmit={handleFinalSelectionOnSelected}
      schema={yupSchemas.selectBatchSchema}
    >
      <SelectField
        name="batchId"
        label="Select Batch for new Applicants"
        options={batches}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Select" />
        <button
          className="btn btn-secondary"
          onClick={() => setSelectedBatchForApplicantsModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      <StatCard cards={itepApplicantStats} />

      <DataTable
        title=" ITEP Applicants "
        data={itepApplicants}
        columns={columns}
        showSelection={true}
        // approveButton={true}
        // rejectButton={true}
        finalSelectionButton={true}
        // onApprove={(rows) => approveApplicants(rows)}
        // onReject={(rows) => {
        //   setSelectedRow(rows), setRejectModal(true);
        // }}
        onFinalSelection={(rows) => {
          setSelectedRow(rows), setFinalSelectionModal(true);
        }}
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

      <FormModal
        title={`Update Final Selection Status`}
        show={finalSelectionModal}
        onClose={() => setFinalSelectionModal(false)}
        formWrapper={<FinalSelectionFORM />}
      />

      <FormModal
        title={`Ready To Select Applicants `}
        show={selectedBatchForApplicantsModal}
        onClose={() => setSelectedBatchForApplicantsModal(false)}
        formWrapper={<ChooseBatchFORM />}
      />
    </>
  );
};

export default ManagementITEPApplicantPage;
