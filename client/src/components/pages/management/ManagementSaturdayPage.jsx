import FormWrapper from "@/components/common/Form/FormWrapper";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import batchService from "@/services/batchService";
import saturdaysessionService from "@/services/saturdaysessionService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import {
  CalendarDays,
  CheckCircleIcon,
  Clock1,
  Clock10,
  FileText,
  Home,
  LocationEditIcon,
  Mic,
  Pencil,
  TargetIcon,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import InputField from "@/components/common/Form/InputField";

const ManagementSaturdayPage = () => {
  const user = useAuth().user;

  const [sessions, setSessions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [allBatches, setallBatches] = useState([]);

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

  const fetchSessions = async () => {
    try {
      const response = await saturdaysessionService.getAllSession();
      const sessions = response.data || [];
      setSessions(sessions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Sessions are not found");
      } else toast.error("Error in fetchSessions");

      console.log("Error in  fetchSessions", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSessions();
      await fetchAllBatches();
    };

    fetchData();
  }, []);

  function getUpcomingSession() {
    const now = new Date();
    const upcoming = sessions.filter(
      (s) => new Date(s.date) > now // only future sessions
    ).length;

    return upcoming || 0;
  }

  //Stats data
  const statCards = [
    {
      title: " Total ",
      count: sessions?.length,
      icon: <Mic size={18} />,
    },
    {
      title: "Topics Covered",
      count: sessions?.length,
      icon: <CheckCircleIcon size={18} />,
    },
    {
      title: "Upcoming Session",
      count: getUpcomingSession(),
      icon: <Clock1 size={18} />,
    },
  ];

  const sessionColumns = [
    {
      accessorKey: "topic",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Topic
        </div>
      ),
    },
    {
      accessorKey: "ExpertName",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Expert Name
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-capitalize">{row.original.ExpertName}</span>
      ),
    },
    {
      accessorKey: "company",
      header: () => (
        <div className="flex items-center gap-2">
          <Home size={16} />
          <span>Company</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.company}</span>;
      },
    },
    {
      accessorKey: "position",
      header: () => (
        <div className="flex items-center gap-2">
          <LocationEditIcon size={16} />
          <span>Position</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.position}</span>;
      },
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{dateFormatter(row.original.date)}</span>;
      },
    },
    {
      accessorKey: "time",
      header: () => (
        <div className="flex items-center gap-2">
          <Clock10 size={16} />
          <span>Time</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span>{`${row.original.timeFrom} - ${row.original.timeTo}`}</span>
        );
      },
    },
    {
      accessorKey: "targetBatches ",
      header: () => (
        <div className="flex items-center gap-2">
          <TargetIcon size={16} />
          <span>Target batches</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">
            {row.original.batchIds?.map((b) => b.batch_Name + " ")}
          </span>
        );
      },
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
            setEditModal(true);
            setSelectedRow(row.original);
          }}
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const handleEditSaturdaySession = async (data) => {
    try {
      const payLoad = {
        id: selectedRow._id,
        topic: data.topic,
        ExpertName: data.ExpertName,
        company: data.company,
        position: data.position,
        date: data.date,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        batchIds: data.batchIds,
      };
      console.log(payLoad);
      await saturdaysessionService.updateSessionById(payLoad);
      toast.success("Session Edited Successfully 😊");
    } catch (error) {
      if (error.response.status === 409)
        return toast.warn(
          "Session is already scheduled for any of the selected Batches"
        );
      toast.error("Error in session updation");
      console.log("Error in Session Updation", error);
    } finally {
      setEditModal(false);
      fetchSessions();
    }
  };

  const EditSaturdaySessionForm = () => (
    <FormWrapper
      defaultValues={{
        topic: selectedRow?.topic,
        ExpertName: selectedRow?.ExpertName,
        company: selectedRow?.company,
        position: selectedRow?.position,
        date: selectedRow?.date,
        timeFrom: selectedRow?.timeFrom,
        timeTo: selectedRow?.timeTo,
        batchIds: selectedRow?.batchIds,
      }}
      onSubmit={handleEditSaturdaySession}
      schema={yupSchemas.addSaturdaySessionSchema}
    >
      <InputField
        type="text"
        name="topic"
        label="Topic*"
        placeholder="Please enter session topic"
      />
      <InputField
        type="text"
        name="ExpertName"
        label="Expert Name*"
        placeholder="Please enter Expert Name"
      />

      <InputField
        type="text"
        name="company"
        label="Company*"
        placeholder="Enter enter Company"
      />

      <InputField
        type="text"
        name="position"
        label="Position*"
        placeholder="Enter Expert Position"
      />

      <InputField type="date" name="date" label="Session Date*" />

      <InputField type="time" name="timeFrom" label="Time From*" />

      <InputField type="time" name="timeTo" label="Time To*" />

      <CheckboxGroupField
        name="batchIds"
        label="Choose Batches"
        options={allBatches}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update Session" />
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
      <StatCard cards={statCards} />
      <DataTable
        title=" All Sessions "
        data={sessions}
        columns={sessionColumns}
      />

      <FormModal
        title={` Edit Saturday Session`}
        show={editModal}
        onClose={() => setEditModal(false)}
        formWrapper={<EditSaturdaySessionForm />}
      />
    </>
  );
};

export default ManagementSaturdayPage;
