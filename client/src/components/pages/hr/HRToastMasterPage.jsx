import ViewModal from "@/components/modals/ViewModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import toastmasterService from "@/services/toastmasterService";
import {
  CalendarClock,
  Mic2,
  CalendarDays,
  Eye,
  File,
  User,
  Pencil,
  PencilLine,
  WholeWordIcon,
  WholeWord,
  BadgeHelp,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { dateFormatter } from "@/utils/dateFormatter";
import batchService from "@/services/batchService";
import InputField from "@/components/common/Form/InputField";
import yupSchemas from "@/utils/yupSchemas";
import FormWrapper from "@/components/common/Form/FormWrapper";
import FormModal from "@/components/modals/FormModal";
import Button from "@/components/common/UI/Button";
import SelectField from "@/components/common/Form/SelectField";

const HRToastMasterPage = () => {
  const user = useAuth().user;

  const [toastmasterSessions, setToastmasterSessions] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [editFormModal, setEditFormModal] = useState(false);
  const [refinedTMS, setRefinedTMS] = useState([]);
  const [selectedBatchStudentsForTMS, setSelectedBatchStudentsForTMS] =
    useState([]);
  const [selectedBatchForTMS, setSelectedBatchForTMS] = useState(null);

  const fetchSessions = async () => {
    try {
      const response = await toastmasterService.getAll();
      const sessions = response.data || [];
      setToastmasterSessions(
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setRefinedTMS(refineToastmasterSessions(response.data || []));
    } catch (error) {
      if (error && error.response?.status === 404) {
        toast.warn("Sessions are not found");
      } else toast.error("Error in fetchSessions");

      console.log("Error in  fetchSessions", error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      setAllBatches(response.data || []);
    } catch (error) {
      if (error.response && error.response.status !== 409)
        toast.error("Error in fetching fetchAllBatches");
      console.log("Error in fetching fetchAllBatches", error);
    }
  };

  const refineToastmasterSessions = (sessions) => {
    return sessions.map((session) => ({
      ...session,
      roles: session.roles.map((r) => {
        const name = r.student?.userId?.fullName || "N/A";
        return `${name} - ${r.role}`;
      }),
    }));
  };

  const setStudentsForTMS = (batchId) => {
    setSelectedBatchForTMS(batchId);
    const students = allBatches
      .filter((b) => b._id === batchId)[0]
      .students.map((student) => ({
        label: student.userId.fullName,
        value: student._id,
      }));

    setSelectedBatchStudentsForTMS(students);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await fetchSessions();
        await fetchAllBatches();
      }
    };

    fetchData();
  }, []);

  function getUpcomingSession() {
    const now = new Date();
    const upcoming = toastmasterSessions.filter(
      (s) => new Date(s.date) > now // only future sessions
    ).length;

    return upcoming || 0;
  }

  const upcomingSessions = useMemo(() => {
    return getUpcomingSession();
  }, []);

  const handleEditToastmaster = async (data) => {
    try {
      const roles = [
        { student: data.tmod, role: "Toastmaster of the Day", feedback: "" },
        { student: data.grammarian, role: "Grammarian", feedback: "" },
        { student: data.ps1, role: "Prepared Speech 1", feedback: "" },
        { student: data.ps2, role: "Prepared Speech 2", feedback: "" },
        {
          student: data.generalEvaluator,
          role: "General Evaluator",
          feedback: "",
        },
        { student: data.e1, role: "Evaluator 1", feedback: "" },
        { student: data.e2, role: "Evaluator 2", feedback: "" },
        { student: data.ttm, role: "Table Topic Master", feedback: "" },
        { student: data.is1, role: "Impromptu Speaker 1", feedback: "" },
        { student: data.is2, role: "Impromptu Speaker 2", feedback: "" },
        { student: data.is3, role: "Impromptu Speaker 3", feedback: "" },
        { student: data.ac, role: "Ah-Counter", feedback: "" },
        { student: data.timer, role: "Timer", feedback: "" },
      ];

      for (let i = 0; i < roles.length; i++) {
        let student = roles[i].student;
        for (let j = i + 1; j < roles.length; j++) {
          if (roles[j].student === student) {
            return toast.warn("Only One Student per role allowed..!");
          }
        }
      }

      const payLoad = {
        id: selectedRow?._id,
        hostedBy: user?.userId,
        batch: selectedBatchForTMS,
        date: data.date,
        theme: data.theme,
        wordOfDay: data.wordOfDay,
        idiom: data.idiom,
        roles,
      };

      // console.log(payLoad);
      await toastmasterService.editToasterMasterById(payLoad);
      toast.success(`Toast-Master Edit Successfully`);
    } catch (error) {
      console.log("Erorr in handleEditToastmaster", error);
      toast.error("Error in handleEditToastmaster");
    } finally {
      fetchSessions();
      setEditFormModal(false);
      setSelectedRow(null);
      setSelectedBatchStudentsForTMS([]);
    }
  };

  const EditToastmasterForm = () => (
    <FormWrapper
      defaultValues={{
        theme: selectedRow?.theme,
        wordOfDay: selectedRow?.wordOfDay,
        idiom: selectedRow?.idiom,
        date: selectedRow?.date,
        tmod: "",
        grammarian: "",
        ps1: "",
        ps2: "",
        generalEvaluator: "",
        e1: "",
        e2: "",
        ttm: "",
        is1: "",
        is2: "",
        is3: "",
        ac: "",
        timer: "",
      }}
      schema={yupSchemas.createToastMasterSchema}
      onSubmit={handleEditToastmaster}
    >
      <InputField
        type="text"
        name="theme"
        label="Theme*"
        placeholder="Please enter theme of the day"
      />
      <InputField
        type="text"
        name="wordOfDay"
        label="Word*"
        placeholder="Please enter word of the day"
      />

      <InputField
        type="text"
        name="idiom"
        label="Idiom*"
        placeholder="Enter idiom of the day"
      />

      <InputField type="date" name="date" label="Date*" />

      <SelectField
        name="tmod"
        label="Toastmaster of the Day"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="grammarian"
        label="Grammarian"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ps1"
        label="Prepared Speech 1"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ps2"
        label="Prepared Speech 2"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="generalEvaluator"
        label="General Evaluator"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="e1"
        label="Evaluator 1"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="e2"
        label="Evaluator 2"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ttm"
        label="Table Topic Master"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="is1"
        label="Impromptu Speaker 1"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="is2"
        label="Impromptu Speaker 2"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="is3"
        label="Impromptu Speaker 3"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ac"
        label="Ah-Counter"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="timer"
        label="Timer"
        options={selectedBatchStudentsForTMS}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditFormModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  //Stats data
  const statCards = [
    {
      title: "Total TMS",
      count: toastmasterSessions?.length,
      icon: <Mic2 size={18} />,
    },
    {
      title: "Upcoming TMS",
      count: upcomingSessions,
      icon: <CalendarClock size={18} />,
    },
  ];

  const tmsColumns = [
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
      accessorKey: "theme",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <WholeWordIcon size={16} /> Theme
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-capitalize">{row.original.theme}</span>
      ),
    },
    {
      accessorKey: "wordOfDay",
      header: () => (
        <div className="flex items-center gap-2">
          <WholeWordIcon size={16} />
          <span>Word</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.wordOfDay}</span>;
      },
    },
    {
      accessorKey: "idiom",
      header: () => (
        <div className="flex items-center gap-2">
          <WholeWord size={16} />
          <span>Idiom</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.idiom}</span>;
      },
    },

    {
      accessorKey: "hostedBy",
      header: () => (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>Hosted By</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.hostedBy?.fullName}</span>;
      },
    },
    {
      accessorKey: "batch",
      header: () => (
        <div className="flex items-center gap-2">
          <BadgeHelp size={16} />
          <span>Batch</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">{row.original.batch?.batch_Name}</span>
        );
      },
    },
    {
      accessorKey: "edit",
      header: () => (
        <div className="flex items-center gap-2">
          <PencilLine size={16} />
          <span>Edit</span>
        </div>
      ),
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setSelectedRow(row.original),
              setEditFormModal(true),
              setStudentsForTMS(row.original.batch._id);
          }}
        >
          <Pencil size={16} className="me-1" />
        </button>
      ),
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

  const tmsFields = [
    { key: "date", label: "Date", type: "date" },
    { key: "theme", label: "Theme Of The Day" },
    {
      key: "wordOfDay",
      label: "Word Of The Day",
    },
    {
      key: "idiom",
      label: "Idiom",
    },
    {
      key: "hostedBy.fullName",
      label: "Hosted By",
    },
    {
      key: "batch.batch_Name",
      label: "Batch Name",
    },
    {
      key: "roles",
      label: "Roles",
      type: "list",
    },
  ];

  return (
    <>
      <StatCard cards={statCards} />

      <DataTable
        title=" All Toast-Master Sessions "
        data={toastmasterSessions}
        columns={tmsColumns}
      />

      {/* Modal for company Edit */}
      <FormModal
        title={`Edit - ${selectedRow?.theme}`}
        show={editFormModal}
        onClose={() => setEditFormModal(false)}
        formWrapper={<EditToastmasterForm />}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={tmsFields}
        title={selectedRow?.theme}
        data={refinedTMS.find((tms) => tms?._id === selectedRow?._id)}
      />
    </>
  );
};

export default HRToastMasterPage;
