import FormWrapper from "@/components/common/Form/FormWrapper";
import TextAreaField from "@/components/common/Form/TextAreaField";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import saturdaysessionService from "@/services/saturdaysessionService";
import studentService from "@/services/studentService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import {
  CalendarDays,
  CheckCircleIcon,
  Clock1,
  Clock10,
  EditIcon,
  FileEdit,
  FileText,
  Home,
  LocationEditIcon,
  Mic,
  User,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const StudentSaturdaySessionsPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState(false);
  const [currentFeedBack, setCurrentFeedback] = useState("");

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudentByUserId(user.userId);
      setStudent(response.data || []);
      return response.data || []
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Student is not found");
      } else toast.error("Error in fetchStudent");

      console.log("Error in  fetchStudent", error);
    }
  };

  const fetchSessions = async (id) => {
    try {
      const response =
        await saturdaysessionService.getAllSaturdaySessionsByStudentId(id);
        const sessions = response.data || []
      setSessions(
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Sessions are not found");
      } else toast.error("Error in fetchSessions");

      console.log("Error in  fetchSessions", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchSessions(student?._id);
      }
    };

    fetchData();
  }, []);

  function getUpcomingSession(currentBatchId) {
    const now = new Date();
    const upcoming = sessions
      .filter(
        (s) =>
          new Date(s.date) > now && // only future sessions
          s.batchIds.some((batch) =>
            typeof batch === "object"
              ? batch._id == currentBatchId
              : batch == currentBatchId
          )
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    return upcoming || null;
  }

  const nextSession = useMemo(() => {
    if (student?.assigned_batch?._id) {
      return getUpcomingSession(student.assigned_batch._id);
    }
    return null;
  }, [sessions?.length, student?._id]);

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
      count: nextSession?.topic || 0,
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
      accessorKey: "feedback",
      header: () => (
        <div className="flex items-center gap-2">
          <FileEdit size={16} />
          <span>Feedback</span>
        </div>
      ),
      cell: ({ row }) => (
        <EditIcon
          size={18}
          onClick={() => {
            setSelectedRow(row.original), setFeedbackForm(true);

            row.original.feedbacks.forEach((f) => {
              if (f.studentId === student._id && f.feedback !== "") {
                setCurrentFeedback(f.feedback);
                return;
              }
            });
          }}
        />
      ),
    },
  ];

  const handleFeedbackSubmit = async (data) => {
    try {
      const payLoad = {
        feedback: data.feedback,
      };

      await saturdaysessionService.giveFeedback(
        student?._id,
        selectedRow?._id,
        payLoad
      );

      toast.success("Feedback submitted");
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Session is not found");
      } else toast.error("Error in handleFeedbackSubmit");

      console.log("Error in  handleFeedbackSubmit", error);
    } finally {
      fetchSessions(student?._id);
      setSelectedRow(null);
      setFeedbackForm(false);
    }
  };

  const GiveFeedbackForm = () => (
    <FormWrapper
      defaultValues={{
        feedback: currentFeedBack,
      }}
      schema={yupSchemas.projectFeedbackSchema}
      onSubmit={handleFeedbackSubmit}
    >
      <TextAreaField
        name="feedback"
        label="Give Feedback"
        placeholder={`Enter ${selectedRow?.topic} session feedback`}
      />
      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update Feedback" />
        <button
          className="btn btn-secondary"
          onClick={() => {
            setFeedbackForm(false), setSelectedRow(null);
          }}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      {student && <StatCard cards={statCards} />}
      {student && (
        <DataTable
          title=" All Sessions "
          data={sessions}
          columns={sessionColumns}
        />
      )}
      <FormModal
        title={`${selectedRow?.topic} session feedback`}
        show={feedbackForm}
        onClose={() => {
          setFeedbackForm(false), setSelectedRow(null);
        }}
        formWrapper={<GiveFeedbackForm />}
      />
    </>
  );
};

export default StudentSaturdaySessionsPage;
