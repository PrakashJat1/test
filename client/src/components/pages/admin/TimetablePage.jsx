import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import ConfirmModal from "@/components/modals/ConfirmModal";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import batchService from "@/services/batchService";
import timetableService from "@/services/timetableService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import {
  FileText,
  GraduationCap,
  UserRound,
  Clock,
  Eye,
  TimerReset,
  Upload,
  EqualApproximately,
  Pencil,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TimetablePage = () => {
  const { user } = useAuth();
  const [allTimeTables, setAllTimeTables] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addTimeTableModal, setAddTimeTableModal] = useState(false);
  const [editTimeTableModal, setEditTimeTableModal] = useState(false);

  const timetableStats = [
    {
      title: "Total TimeTable",
      count: allTimeTables.length,
      icon: <FileText size={18} />,
    },
    {
      title: "This Month",
      count: allTimeTables.filter((tm) => {
        const sessionDate = new Date(tm.uploadedOn);
        return (
          sessionDate.getMonth() === new Date().getMonth() &&
          sessionDate.getFullYear() === new Date().getFullYear()
        );
      }).length,
      icon: <TimerReset size={18} />,
    },
    {
      title: "Uploded for Batches",
      count: [...new Set(allTimeTables.map((t) => t.batchId))].length,
      icon: <Upload size={18} />,
    },

    {
      title: "Reamining Batches",
      count:
        allBatches.length -
        [...new Set(allTimeTables.map((t) => t.batchId))].length,
      icon: <EqualApproximately size={18} />,
    },
  ];

  const timetableColumns = [
    {
      accessorKey: "Name",
      header: () => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Time Table Name
        </div>
      ),
      cell: ({ getValue }) => <span>{getValue()}</span>,
    },
    {
      accessorKey: "batchId.batch_Name", // or use "batchId.batch_Name" if populated
      header: () => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Batch Name
        </div>
      ),
      cell: ({ getValue }) => <span>{getValue()}</span>,
    },
    {
      accessorKey: "uploadedBy.fullName",
      header: () => (
        <div className="flex items-center gap-2">
          <UserRound className="w-4 h-4" />
          Uploaded By
        </div>
      ),
      cell: ({ getValue }) => <span>{getValue()}</span>,
    },
    {
      accessorKey: "uploadedOn",
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Uploaded On
        </div>
      ),
      cell: ({ getValue }) => (getValue() ? dateFormatter(getValue()) : "-"),
    },
    {
      accessorKey: "file.secure_id",
      header: () => (
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          View
        </div>
      ),
      cell: ({ getValue }) =>
        getValue ? (
          <a
            href={getValue()}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary"
          >
            <Eye className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-muted">No File</span>
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
          title="Edit Batch"
          onClick={() => {
            setEditTimeTableModal(true);
            setSelectedRow(row.original);
          }}
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const fetchAllTimeTables = async () => {
    try {
      const response = await timetableService.getAll();
      setAllTimeTables(response.data || []);
    } catch (error) {
      toast.error("Error in fetching AllTimeTables");
      console.log("Error in fetching AllTimeTables", error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      setAllBatches(response.data || []);
    } catch (error) {
      toast.error("Error in AllBatches fetching");
      console.log("Error in AllBatches fetching", error);
    }
  };
  useEffect(() => {
    fetchAllTimeTables();
    fetchAllBatches();
  }, []);

  const deleteAllTimeTables = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
    };
    try {
      await timetableService.deleteByIds(data);
      fetchAllTimeTables();
      toast.success("Timetables deleted successfully");
    } catch (error) {
      console.log("Erorr in deleteAllTimeTables", error);
      toast.error("Error in deleteAllTimeTables");
    } finally {
      setDeleteModal(false);
      fetchAllTimeTables();
    }
  };

  const handleAddTimeTable = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Name", data.Name);
      formData.append("batchId", data.batchId);
      formData.append("uploadedBy", user.userId);

      console.log(data);
      if (data?.timetable?.[0]) {
        formData.append("timetable", data?.timetable?.[0]); // only first file
      }
      await timetableService.addTimeTable(formData);
      toast.success(`${data.Name} Added Successfully`);
      fetchAllTimeTables();
    } catch (error) {
      console.log("Erorr in handleAddTimeTable", error);
      toast.error("Error in handleAddTimeTable");
    } finally {
      fetchAllTimeTables();
      setSelectedRow(null);
      setAddTimeTableModal(false);
    }
  };

  const handleEditTimeTable = async (data) => {
    try {
      const payLoad = {
        id: selectedRow._id,
        Name: data.Name,
        batchId: data.batchId,
      };
      await timetableService.editTimeTable(payLoad);
      toast.success(`${data.Name} Edited Successfully`);
    } catch (error) {
      console.log("Erorr in handleEditTimeTable", error);
      toast.error("Error in handleEditTimeTable");
    } finally {
      fetchAllTimeTables();
      setSelectedRow(null);
      setEditTimeTableModal(false);
    }
  };

  const EditTimeTableForm = () => (
    <FormWrapper
      defaultValues={{
        Name: selectedRow?.Name,
        batchId: selectedRow?.batchId?.batch_Name,
      }}
      schema={yupSchemas.editTimeTableSchema}
      onSubmit={handleEditTimeTable}
    >
      <InputField
        type="text"
        name="Name"
        label="Time Table Name*"
        placeholder="Please enter Time Table Name"
      />
      <SelectField
        name="batchId"
        label="Batch*"
        options={allBatches.map((b) => ({
          label: b.batch_Name,
          value: b._id,
        }))}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditTimeTableModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const AddTimeTableForm = () => (
    <FormWrapper
      defaultValues={{
        Name: "",
        batchId: "",
        timetable: "",
      }}
      schema={yupSchemas.addTimeTableSchema}
      onSubmit={handleAddTimeTable}
    >
      <InputField
        type="text"
        name="Name"
        label="Time Table Name*"
        placeholder="Please enter Time Table Name"
      />
      <SelectField
        name="batchId"
        label="Batch*"
        options={allBatches.map((b) => ({
          label: b.batch_Name,
          value: b._id,
        }))}
      />

      <InputField type="file" name="timetable" label="Choose Image*" />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddTimeTableModal(false)}
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
        title=" Time Tables  "
        data={allTimeTables}
        columns={timetableColumns}
        showSelection={true}
        deleteButton="true"
        addButton="true"
        onAdd={() => setAddTimeTableModal(true)}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
      />

      {/* Confirm Book Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected Time Tables"}
        onConfirm={() => {
          deleteAllTimeTables(selectedRow),
            setDeleteModal(false),
            setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />

      {/* Edit Time Table Form */}
      <FormModal
        title={`Edit ${selectedRow?.Name}`}
        show={editTimeTableModal}
        onClose={() => {
          setEditTimeTableModal(false);
          setSelectedRow(null);
        }}
        formWrapper={<EditTimeTableForm />}
      />

      {/* Add Time Table Form */}
      <FormModal
        title={`Add new Time Table`}
        show={addTimeTableModal}
        onClose={() => {
          setAddTimeTableModal(false), setSelectedRow(null);
        }}
        formWrapper={<AddTimeTableForm />}
      />
    </>
  );
};

export default TimetablePage;
