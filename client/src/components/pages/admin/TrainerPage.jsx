import React, { useEffect, useState } from "react";
import {
  UserCog,
  Code2,
  BookOpenText,
  Brain,
  User,
  Mail,
  FlaskConical,
  Tag,
  Paperclip,
  ClockIcon,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
} from "lucide-react";
import trainerService from "@/services/trainerService";
import StatCard from "@/layouts/StatCard";
import { toast } from "react-toastify";
import ViewModal from "@/components/modals/ViewModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import DataTable from "@/layouts/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import userService from "@/services/userService";
import batchService from "@/services/batchService";
import FormModal from "@/components/modals/FormModal";
import yupSchemas from "@/utils/yupSchemas";
import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import FormWrapper from "@/components/common/Form/FormWrapper";
import Button from "@/components/common/UI/Button";

const TrainerPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [batchesOtherfromTraineAssigned, setBatchesOtherfromTraineAssigned] =
    useState([]);
  const [assignBatchesmodal, setAssignBatchesmodal] = useState(false);
  const [removeAssignedBatchesmodal, setRemoveAssignedBatchesmodal] =
    useState(false);

  const fetchAllTrainers = async () => {
    try {
      const response = await trainerService.getAll();
      setTrainers(response.data || []);
    } catch (error) {
      toast.error("Error in fetching Trainers");
      console.log("Error in fetching Trainers", error);
    }
  };

  const handleAssignBatch = async (data) => {
    try {
      const payLoad = {
        trainerId: selectedTrainer?._id,
        type_Of_Trainer: selectedTrainer?.type_Of_Trainer,
        batchIds: data.assigned_Batches,
      };

      await trainerService.assignBatches(payLoad);
      toast.success("Batches assigned successfully");
      fetchAllTrainers();
      setSelectedTrainer(null);
      setAssignBatchesmodal(false);
    } catch (error) {
      toast.error("Error in handleAssignBatch to Trainer");
      console.log("Error in handleAssignBatch to Trainer", error);
    }
  };

  const handleRemoveAssignedBatch = async (data) => {
    try {
      const payLoad = {
        trainerId: selectedTrainer._id,
        type_Of_Trainer: selectedTrainer.type_Of_Trainer,
        batchIds: data.assigned_Batches,
      };

      await trainerService.removeAssignedBatches(payLoad);
      toast.success("Batches removed successfully");
      fetchAllTrainers();
      setSelectedTrainer(null);
      setRemoveAssignedBatchesmodal(false);
    } catch (error) {
      toast.error("Error in handleRemoveAssignedBatch to Trainer");
      console.log("Error in handleRemoveAssignedBatch to Trainer", error);
    }
  };

  const fetchBatchesForAssignNewBatches = async (trainer) => {
    setSelectedTrainer(trainer);
    try {
      const data = {
        id: trainer._id,
        type_Of_Trainer: trainer.type_Of_Trainer,
      };

      const response =
        await batchService.fetchAllNonAssignedBatchesForAssignNewBatches(data);

      const batches = response.data || [];

      const formattedOptions = batches.map((batch) => ({
        label: batch.batch_Name,
        value: batch._id,
      }));

      setBatchesOtherfromTraineAssigned(formattedOptions);
      setAssignBatchesmodal(true);
      toast.success("Batches fetched successfully");
    } catch (error) {
      if (error && error.response.status === 404)
        toast.error(
          `All Batches are already assigned to ${trainer.userId.fullName}`
        );
      console.log("Error in fetchBatchesForAssignBatch to Trainer", error);
    }
  };

  useEffect(() => {
    fetchAllTrainers();
  }, []);

  const trainerStats = [
    {
      title: "Total Trainers",
      count: trainers.length,
      icon: <UserCog size={25} />,
    },
    {
      title: "Technical",
      count: trainers?.filter(
        (trainer) => trainer.type_Of_Trainer === "technical"
      ).length,
      icon: <Code2 size={25} />,
    },
    {
      title: "Soft Skills",
      count: trainers?.filter(
        (trainer) => trainer.type_Of_Trainer === "softskill"
      ).length,
      icon: <BookOpenText size={25} />,
    },
    {
      title: "Aptitude",
      count: trainers?.filter(
        (trainer) => trainer.type_Of_Trainer === "aptitude"
      ).length,
      icon: <Brain size={25} />,
    },
    // { title: "Lab", count: 1, icon: <MonitorPlay size={25} /> },
  ];

  const columnHelper = createColumnHelper();

  const trainerColumns = [
    columnHelper.accessor("userId.fullName", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <User size={18} /> Name
        </div>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("userId.email", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <Mail size={18} /> Email
        </div>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("type_Of_Trainer", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <FlaskConical size={18} /> Trainer Type
        </div>
      ),
      cell: (info) =>
        info.getValue()?.charAt(0).toUpperCase() + info.getValue()?.slice(1),
    }),

    columnHelper.accessor("assigned_Batches", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <Tag size={18} /> Assigned Batches
        </div>
      ),
      cell: (info) => {
        const batches = info.getValue() || [];
        return batches.length === 0
          ? "None"
          : batches.map((b) => b.batch_Name).join(", ");
      },
    }),

    columnHelper.display({
      id: "assignBatch",
      header: "Assign Batch",
      cell: ({ row }) => (
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            onClick={() => fetchBatchesForAssignNewBatches(row.original)}
          >
            <UserPlus size={16} />
          </button>
        </div>
      ),
    }),

    columnHelper.display({
      id: "removeBatch",
      header: "Remove Batch",
      cell: ({ row }) => (
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            onClick={() => {
              setSelectedTrainer(row.original);
              setRemoveAssignedBatchesmodal(true);
            }}
          >
            <UserMinus size={16} />
          </button>
        </div>
      ),
    }),

    columnHelper.accessor("userId.status", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <ClockIcon size={18} /> Status
        </div>
      ),
      cell: (info) => (
        <div className="text-center w-100">
          {info.getValue() ? (
            <CheckCircle size={20} color="green" />
          ) : (
            <XCircle size={20} color="red" />
          )}
        </div>
      ),
    }),

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

  const fields = [
    { key: "userId.fullName", label: "Full Name" },
    { key: "userId.email", label: "Email" },
    { key: "userId.status", label: "Account Status", type: "boolean" },
    { key: "userId.isverified", label: "Verified", type: "boolean" },
    { key: "userId.createdAt", label: "Created At", type: "date" },
    { key: "userId.role", label: "Role" },
    { key: "type_Of_Trainer", label: "Type of Trainer" },
    { key: "specialization", label: "Specialization" },
  ];

  const BatchAssignedFORM = () => (
    <FormWrapper
      defaultValues={{
        assigned_Batches: [],
      }}
      onSubmit={handleAssignBatch}
      schema={yupSchemas.assignBatchSchema}
    >
      <CheckboxGroupField
        name="assigned_Batches"
        label="Non Assigned Batches"
        options={batchesOtherfromTraineAssigned}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAssignBatchesmodal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const BatchRemoveFORM = () => (
    <FormWrapper
      defaultValues={{
        assigned_Batches: [],
      }}
      onSubmit={handleRemoveAssignedBatch}
      schema={yupSchemas.assignBatchSchema}
    >
      <CheckboxGroupField
        name="assigned_Batches"
        label="Assigned Batches"
        options={selectedTrainer?.assigned_Batches?.map((batch) => ({
          label: batch.batch_Name,
          value: batch._id,
        }))}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setRemoveAssignedBatchesmodal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const activeTrainersAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row.userId._id);
    const data = {
      ids,
      status: true,
    };
    try {
      await userService.updateUserStatusById(data);
      fetchAllTrainers();
      toast.success("Users Activated");
    } catch (error) {
      console.log("Erorr in activeTrainersAccount", error);
      toast.error("Error in activeTrainersAccount");
    }
  };

  const suspendTrainersAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row.userId._id);
    const data = {
      ids,
      status: false,
    };
    try {
      await userService.updateUserStatusById(data);
      fetchAllTrainers();
      toast.success("Users Suspended");
    } catch (error) {
      console.log("Erorr in suspendTrainersAccount", error);
      toast.error("Error in suspendTrainersAccount");
    }
  };

  const deletetrainers = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row.userId._id);
    const data = {
      ids,
    };
    try {
      await userService.deleteUserById(data);
      fetchAllTrainers();
      toast.success("Trainers deleted Successfully");
    } catch (error) {
      console.log("Erorr in deletetrainers", error);
      toast.error("Error in deletetrainers");
    }
  };

  return (
    <>
      <StatCard cards={trainerStats} />
      <DataTable
        title=" All Trainers "
        data={trainers}
        columns={trainerColumns}
        showSelection={true}
        deleteButton={true}
        activeButton={true}
        suspendButton={true}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
        onActive={(rows) => activeTrainersAccount(rows)}
        onSuspend={(rows) => suspendTrainersAccount(rows)}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={fields}
        title={selectedRow?.userId?.fullName}
        data={selectedRow}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected Trainers"}
        onConfirm={() => {
          deletetrainers(selectedRow);
          setDeleteModal(false), setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />
      <FormModal
        title={"Assign new batches"}
        show={assignBatchesmodal}
        onClose={() => setAssignBatchesmodal(false)}
        formWrapper={<BatchAssignedFORM />}
      />

      <FormModal
        title={"Remove Assigned batches"}
        show={removeAssignedBatchesmodal}
        onClose={() => setRemoveAssignedBatchesmodal(false)}
        formWrapper={<BatchRemoveFORM />}
      />
    </>
  );
};

export default TrainerPage;
