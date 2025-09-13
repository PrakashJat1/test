import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import ConfirmModal from "@/components/modals/ConfirmModal";
import FormModal from "@/components/modals/FormModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import batchService from "@/services/batchService";
import timetableService from "@/services/timetableService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementTimetablePage = () => {
  const [allTimebables, setAllTimebables] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [allBatches, setallBatches] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      const batches = response.data || [];

      const formattedOptions = batches.map((batch) => ({
        label: batch.batch_Name,
        value: batch._id,
      }));

      setallBatches(formattedOptions);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("batch list is empty");
      } else toast.error("Error in fetchAllBatches");

      console.log("Error in  fetchAllBatches", error);
    }
  };

  const fetchAllTimetables = async () => {
    try {
      const response = await timetableService.getAll();
      setAllTimebables(response.data || []);
    } catch (error) {
      toast.error("Error in fetching AllTimetables");
      console.log("Error in fetching AllTimetables", error);
    }
  };

  const timetableStats = [
    {
      title: "Total TimeTables",
      count: allTimebables?.length,
      icon: <Timer size={18} />,
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
      accessorKey: "uploadedBy",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={18} /> Uploaded By
        </div>
      ),
      cell: ({ row }) => <span>{row.original.uploadedBy.fullName}</span>,
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
      accessorKey: "file",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <File size={18} /> File
        </div>
      ),
      cell: ({ row }) => (
        <a href={row.original.file.secure_id} target="_blank">
          <EyeIcon size={16} />
        </a>
      ),
    },
    {
      accessorKey: "edit",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Pencil size={16} /> Edit
        </div>
      ),
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-secondary"
          title="Edit Time-table"
          onClick={() => {
            setEditModal(true);
            setSelectedRow(row.original);
          }}
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  useEffect(() => {
    fetchAllTimetables();
    fetchAllBatches();
  }, []);

  const deleteTimetables = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
    };
    try {
      await timetableService.deleteByIds(data);
      toast.success("Time tables deleted successfully");
    } catch (error) {
      toast.error("Error in deleteTimetables");
      console.log("Erorr in deleteTimetables", error);
    } finally {
      fetchAllTimetables();
    }
  };

  const handleUpdateTimetable = async (data) => {
    try {
      const formData = new FormData();
      formData.append("id", selectedRow._id);
      formData.append("Name", data.Name);
      formData.append("batchId", data.batchId);

      if (data?.timetable?.[0]) {
        formData.append("timetable", data?.timetable?.[0]); // only first file
      }
      const response = await timetableService.editTimeTable(formData);
      toast.success(response.data.message);
    } catch (error) {
      console.log("Erorr in handleUpdateTimetable", error);
      toast.error("Error in handleUpdateTimetable");
    } finally {
      setEditModal(false);
      fetchAllTimetables();
    }
  };

  const EditTimetableForm = () => (
    <FormWrapper
      defaultValues={{
        Name: selectedRow?.Name,
        batchId: selectedRow?.batchId,
        timetable: "",
      }}
      schema={yupSchemas.addTimeTableSchema}
      onSubmit={handleUpdateTimetable}
    >
      <InputField
        type="text"
        name="Name"
        label="Time Table Name*"
        placeholder="Please enter Time Table Name"
      />
      <SelectField name="batchId" label="Batch*" options={allBatches} />

      <InputField type="file" name="timetable" label="Choose Image*" />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      <StatCard cards={timetableStats} />

      <DataTable
        title=" All Timetables "
        data={allTimebables}
        columns={timetableColumns}
        showSelection={true}
        deleteButton={true}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
      />

      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected time-tables"}
        onConfirm={() => {
          deleteTimetables(selectedRow),
            setDeleteModal(false),
            setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />
      {/* Edit Timetable Form */}
      <FormModal
        title={`Edit ${selectedRow?.Name}`}
        show={editModal}
        onClose={() => {
          setEditModal(false);
          setSelectedRow(null);
        }}
        formWrapper={<EditTimetableForm />}
      />
    </>
  );
};

export default ManagementTimetablePage;
