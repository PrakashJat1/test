import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import ConfirmModal from "@/components/modals/ConfirmModal";
import FormModal from "@/components/modals/FormModal";
import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import batchService from "@/services/batchService";
import studentService from "@/services/studentService";
import trainerService from "@/services/trainerService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CheckCircle2,
  Clock,
  LayoutGrid,
  UserCog,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageSquare,
  RefreshCcw,
  User,
  Brain,
  Eye,
  Pencil,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BatchPage = () => {
  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]); //for view
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [addBatchModal, setAddBatchModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [technicalTrainers, setTechnicalTrainers] = useState([]);
  const [softskillTrainers, setSoftskillTrainers] = useState([]);
  const [aptitudeTrainers, setAptitudeTrainers] = useState([]);

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      setBatches(response.data || []);
    } catch (error) {
      toast.error("Error in AllBatches fetching");
      console.log("Error in AllBatches fetching", error);
    }
  };

  const fetchAllTrainers = async () => {
    try {
      const response = await trainerService.getAll();
      setTrainers(response.data || []);
      const trainers = response.data || [];

      setTechnicalTrainers(
        trainers.filter((trainer) => trainer.type_Of_Trainer === "technical")
      );
      setSoftskillTrainers(
        trainers.filter((trainer) => trainer.type_Of_Trainer === "softskill")
      );
      setAptitudeTrainers(
        trainers.filter((trainer) => trainer.type_Of_Trainer === "aptitude")
      );
    } catch (error) {
      toast.error("Error in fetching Trainers");
      console.log("Error in fetching Trainers", error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data || []);
    } catch (error) {
      toast.error("Error in fetching students");
      console.log("Error in fetching students", error);
    }
  };

  useEffect(() => {
    fetchAllBatches();
    fetchAllTrainers();
    fetchAllStudents();
  }, []);

  const batchStats = [
    {
      title: "Total Batches",
      count: batches.length,
      icon: <LayoutGrid size={18} />,
    },
    {
      title: "Completed",
      count: batches.filter((batch) => batch.status === "completed").length,
      icon: <CheckCircle2 size={18} />,
    },
    {
      title: "Ongoing",
      count: batches.filter((batch) => batch.status === "ongoing").length,
      icon: <Clock size={18} />,
    },
    {
      title: "Assigned Trainers",
      count: batches.reduce((total, batch) => {
        return (
          total +
          (batch.technicalTrainer ? 1 : 0) +
          (batch.softskillTrainer ? 1 : 0) +
          (batch.aptitudeTrainer ? 1 : 0)
        );
      }, 0),
      icon: <UserCog size={18} />,
    },
  ];

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("batch_Name", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Batch Name
        </div>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("start_Date", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Calendar size={16} /> Start Date
        </div>
      ),
      cell: (info) => dateFormatter(info.getValue()), // new Date(info.getValue()).toLocaleDateString(),
    }),

    columnHelper.accessor("end_Date", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Calendar size={16} /> End Date
        </div>
      ),
      cell: (info) => dateFormatter(info.getValue()), //new Date(info.getValue()).toLocaleDateString(),
    }),

    columnHelper.accessor("students", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <GraduationCap size={16} /> Total Students
        </div>
      ),
      cell: (info) => info.getValue()?.length ?? 0,
    }),

    columnHelper.accessor("technicalTrainer.userId.fullName", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <UserCog size={16} /> Technical Trainer
        </div>
      ),
      cell: (info) => info.getValue() ?? "Not Assigned",
    }),

    columnHelper.accessor("softskillTrainer.userId.fullName", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <MessageSquare size={16} /> Soft Skills Trainer
        </div>
      ),
      cell: (info) => info.getValue() ?? "Not Assigned",
    }),

    columnHelper.accessor("aptitudeTrainer.userId.fullName", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Brain size={16} /> Aptitude Trainer
        </div>
      ),
      cell: (info) => info.getValue() ?? "Not Assigned",
    }),

    columnHelper.accessor("status", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <BookOpen size={16} /> Status
        </div>
      ),
      cell: (info) => {
        const status = info.getValue();
        let badgeClass = "";

        switch (status) {
          case "completed":
            badgeClass = "bg-success";
            break;
          case "ongoing":
            badgeClass = "bg-warning text-dark";
            break;
          case "upcoming":
            badgeClass = "bg-info text-dark";
            break;
          default:
            badgeClass = "bg-secondary";
        }

        return <span className={`badge ${badgeClass}`}>{status}</span>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <RefreshCcw size={16} /> Details
        </div>
      ),
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setSelectedRow(row.original);
            setViewModal(true);
          }}
        >
          <Eye size={16} />
        </button>
      ),
    }),
    columnHelper.display({
      id: "edit",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Pencil size={16} /> Edit
        </div>
      ),
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-secondary"
          title="Edit Batch"
          onClick={() => {
            setEditModal(true);
            setSelectedRow(row.original);
          }}
        >
          <Pencil size={16} />
        </button>
      ),
    }),
  ];

  //View Modal Fields
  const batchViewFields = [
    { key: "batch_Name", label: "Batch Name" },
    { key: "batch_No", label: "Batch Number" },
    { key: "status", label: "Batch Status" },
    { key: "start_Date", label: "Start Date", type: "date" },
    { key: "end_Date", label: "End Date", type: "date" },

    { key: "technicalTrainer.userId.fullName", label: "Technical Trainer" },
    { key: "technicalTrainer.userId.email", label: "Tech Trainer Email" },
    { key: "technicalTrainer.specialization", label: "Tech Specialization" },

    { key: "aptitudeTrainer.userId.fullName", label: "Aptitude Trainer" },
    { key: "aptitudeTrainer.userId.email", label: "Aptitude Trainer Email" },
    { key: "aptitudeTrainer.specialization", label: "Aptitude Specialization" },
    { key: "softskillTrainer.userId.fullName", label: "Soft Skills Trainer" },
    {
      key: "softskillTrainer.userId.email",
      label: "Soft Skills Trainer Email",
    },
    {
      key: "softskillTrainer.specialization",
      label: "Soft Skills Specialization",
    },
    { key: "students.length", label: "Total Students" },
    { key: "createdAt", label: "Batch Created On", type: "datetime" },
  ];

  const handleEditBatch = async (data) => {
    try {
      const payLoad = {
        id: selectedRow._id,
        batch_Name: data.batch_Name,
        batch_No: data.batch_No,
        status: data.status,
        start_Date: data.start_Date,
        end_Date: data.end_Date,
        technicalTrainer: data.technicalTrainer,
        softskillTrainer: data.softskillTrainer,
        aptitudeTrainer: data.aptitudeTrainer,
      };

      await batchService.editBatch(payLoad);
      fetchAllBatches();
      toast.success(`${selectedRow?.batch_Name} Edited Successfully`);
    } catch (error) {
      console.log("Erorr in handleEditBatch", error);
      toast.error("Error in handleEditBatch");
    } finally {
      setEditModal(false);
    }
  };

  const handleAddBatch = async (data) => {
    try {
      const payLoad = {
        batch_Name: data.batch_Name,
        batch_No: data.batch_No,
        status: data.status,
        start_Date: data.start_Date,
        end_Date: data.end_Date,
        technicalTrainer: data.technicalTrainer,
        softskillTrainer: data.softskillTrainer,
        aptitudeTrainer: data.aptitudeTrainer,
      };

      await batchService.addBatch(payLoad);
      fetchAllBatches();
      toast.success(`${data?.batch_Name} Added Successfully`);
    } catch (error) {
      console.log("Erorr in handleAddBatch", error);
      toast.error("Error in handleAddBatch");
    } finally {
      setAddBatchModal(false);
    }
  };

  const EditBatchForm = () => (
    <FormWrapper
      defaultValues={{
        batch_Name: selectedRow.batch_Name,
        batch_No: selectedRow.batch_No,
        status: selectedRow.status,
        start_Date: selectedRow.start_Date?.slice(0, 10),
        end_Date: selectedRow.end_Date?.slice(0, 10),
        technicalTrainer: selectedRow.technicalTrainer?._id,
        softskillTrainer: selectedRow.softskillTrainer?._id,
        aptitudeTrainer: selectedRow.aptitudeTrainer?._id,
        // students: selectedRow.students?.map((s) => s._id) || [],
      }}
      schema={yupSchemas.batchEditSchema}
      onSubmit={handleEditBatch}
    >
      <InputField
        type="text"
        name="batch_Name"
        label="Batch Name*"
        placeholder="Please enter your email"
      />
      <InputField
        type="number"
        name="batch_No"
        label="Batch Number*"
        placeholder="Please enter your fullName"
      />

      <SelectField
        name="status"
        label="Status*"
        options={[
          { label: "Ongoing", value: "ongoing" },
          { label: "Completed", value: "completed" },
          { label: "Upcoming", value: "upcoming" },
        ]}
      />

      <InputField
        type="date"
        name="start_Date"
        label="Start Date*"
        placeholder="Enter Confirm Password"
      />

      <InputField
        type="date"
        name="end_Date"
        label="End date"
        placeholder="Enter your father name"
      />

      <SelectField
        name="technicalTrainer"
        label="Technical Trainer*"
        options={technicalTrainers
          .filter((trainer) => trainer._id !== selectedRow.technicalTrainer)
          .map((trainer) => ({
            label: trainer.userId.fullName,
            value: trainer._id,
          }))}
      />

      <SelectField
        name="softskillTrainer"
        label="Soft Skill Trainer*"
        options={softskillTrainers
          .filter((trainer) => trainer._id !== selectedRow.softskillTrainer)
          .map((trainer) => ({
            label: trainer.userId.fullName,
            value: trainer._id,
          }))}
      />

      <SelectField
        name="aptitudeTrainer"
        label="Aptitude Trainer*"
        options={aptitudeTrainers
          .filter((trainer) => trainer._id !== selectedRow.aptitudeTrainer)
          .map((trainer) => ({
            label: trainer.userId.fullName,
            value: trainer._id,
          }))}
      />

      {/* <MultiSelectField
        name="students"
        label="Assigned Students"
        options={students.filter(
          (s) => !s.assigned_batch || s.assigned_batch === selectedRow._id
        )}
        valueKey="_id"
        labelKey="userId.fullName"
      /> */}

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const AddBatchForm = () => (
    <FormWrapper
      defaultValues={{
        batch_Name: "",
        batch_No: "",
        status: "",
        start_Date: "",
        end_Date: "",
        technicalTrainer: "",
        softskillTrainer: "",
        aptitudeTrainer: "",
        students: [],
      }}
      schema={yupSchemas.batchEditSchema}
      onSubmit={handleAddBatch}
    >
      <InputField
        type="text"
        name="batch_Name"
        label="Batch Name*"
        placeholder="Please enter Batch Name"
      />
      <InputField
        type="number"
        name="batch_No"
        label="Batch Number*"
        placeholder="Please enter Batch Number"
      />

      <SelectField
        name="status"
        label="Status*"
        options={[
          { label: "Ongoing", value: "ongoing" },
          { label: "Completed", value: "completed" },
          { label: "Upcoming", value: "upcoming" },
        ]}
      />

      <InputField type="date" name="start_Date" label="Start Date*" />

      <InputField type="date" name="end_Date" label="End date" />

      <SelectField
        name="technicalTrainer"
        label="Technical Trainer*"
        options={technicalTrainers
          .filter((trainer) => trainer._id !== selectedRow.technicalTrainer)
          .map((trainer) => ({
            label: trainer.userId.fullName,
            value: trainer._id,
          }))}
      />

      <SelectField
        name="softskillTrainer"
        label="Soft Skill Trainer*"
        options={softskillTrainers
          .filter((trainer) => trainer._id !== selectedRow.softskillTrainer)
          .map((trainer) => ({
            label: trainer.userId.fullName,
            value: trainer._id,
          }))}
      />

      <SelectField
        name="aptitudeTrainer"
        label="Aptitude Trainer*"
        options={aptitudeTrainers
          .filter((trainer) => trainer._id !== selectedRow.aptitudeTrainer)
          .map((trainer) => ({
            label: trainer.userId.fullName,
            value: trainer._id,
          }))}
      />
      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddBatchModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const deleteBatches = async (rows) => {
    setSelectedRow(null);
    const ids = rows.map((row) => row._id);

    const data = {
      ids,
    };

    try {
      // await batchService.deleteBatches(data);
      fetchAllBatches();
      toast.warn("Currently It is disabled");
    } catch (error) {
      console.log("Erorr in deleteApplicants", error);
      toast.error("Error in deleteApplicants");
    }
  };

  return (
    <>
      <StatCard cards={batchStats} />
      <DataTable
        title="All Batches"
        data={batches}
        columns={columns}
        showSelection={true}
        deleteButton={true}
        addButton={true}
        onAdd={() => setAddBatchModal(true)}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={batchViewFields}
        title={selectedRow?.batch_Name}
        data={selectedRow}
      />
      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={
          "Do you want to permanently delete selected batches because all the references whould be removed from related data also including students, trainers, assessments, projects, toast-master sessions, saturday sessions, timetables, pdfs"
        }
        onConfirm={() => {
          deleteBatches(selectedRow);
          setDeleteModal(false), setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />
      <FormModal
        title={`Edit ${selectedRow?.batch_Name}`}
        show={editModal}
        onClose={() => setEditModal(false)}
        formWrapper={<EditBatchForm />}
      />
      <FormModal
        title={`Add new Batch`}
        show={addBatchModal}
        onClose={() => setAddBatchModal(false)}
        formWrapper={<AddBatchForm />}
      />
    </>
  );
};

export default BatchPage;
