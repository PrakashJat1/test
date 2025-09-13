import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import studentService from "@/services/studentService";
import toastmasterService from "@/services/toastmasterService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  CalendarDays,
  CheckCircleIcon,
  Clock1,
  FileEdit,
  Mic,
  User,
  UserCircle,
  WholeWord,
  WholeWordIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const StudentToastMastersPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudentByUserId(user.userId);
      setStudent(response.data || []);
      return response.data || [];
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Student is not found");
      } else toast.error("Error in fetchStudent");

      console.log("Error in  fetchStudent", error);
    }
  };

  const fetchSessions = async (id) => {
    try {
      const response = await toastmasterService.getAllSessionsByBatchId(id);
      const sessions = response.data || [];
      setSessions(sessions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      if (error && error.response?.status === 404) {
        toast.warn("Sessions are not found");
      } else toast.error("Error in fetchSessions");

      console.log("Error in  fetchSessions", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchSessions(student?.assigned_batch?._id);
      }
    };

    fetchData();
  }, []);

  const nextSession = useMemo(() => {
    if (student?.assigned_batch?._id && Array.isArray(sessions)) {
      return getUpcomingSession(student.assigned_batch._id);
    }
    return null;
  }, [student?.assigned_batch?._id, sessions]);

  const sessionAttendedCount = useMemo(() => {
    if (student?._id && Array.isArray(sessions)) {
      return sessionAttended();
    }
    return 0;
  }, [student?._id, sessions]);

  function getUpcomingSession(currentBatchId) {
    const now = new Date();
    const upcoming = sessions
      ?.filter(
        (s) =>
          new Date(s.date) > now &&
          s.batchIds?.some((batch) =>
            typeof batch === "object"
              ? batch._id == currentBatchId
              : batch == currentBatchId
          )
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    return upcoming || null;
  }

  function sessionAttended() {
    let count = 0;
    sessions?.forEach((s) => {
      s.roles?.forEach((r) => {
        if (r.student?._id === student?._id) count++;
      });
    });
    return count;
  }

  //Stats data
  const statCards = [
    {
      title: " Total ",
      count: sessions?.length,
      icon: <Mic size={18} />,
    },
    {
      title: "Sessions Attended",
      count: sessionAttendedCount,
      icon: <CheckCircleIcon size={18} />,
    },
    {
      title: "Upcoming Session",
      count:
        dateFormatter(nextSession?.date) !== "Invalid Date"
          ? dateFormatter(nextSession?.date)
          : "-",
      icon: <Clock1 size={18} />,
    },
  ];

  const toastmasterColumns = [
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
      accessorKey: "role",
      header: () => (
        <div className="flex items-center gap-2">
          <UserCircle size={16} />
          <span>Role</span>
        </div>
      ),
      cell: ({ row }) => {
        const roleEntry = row.original?.roles?.find(
          (r) => r.student?._id === student?._id || r.student === student?._id
        );
        return <span className="font-medium">{roleEntry?.role || "—"}</span>;
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
      cell: ({ row }) => {
        const roleEntry = row.original?.roles?.find(
          (r) => r.student?._id === student?._id || r.student === student?._id
        );
        return (
          <span className="font-medium">{roleEntry?.feedback || "—"}</span>
        );
      },
    },
  ];

  return (
    <>
      {student && <StatCard cards={statCards} />}
      {student && (
        <DataTable
          title=" Toast-master Sessions "
          data={sessions}
          columns={toastmasterColumns}
        />
      )}
    </>
  );
};

export default StudentToastMastersPage;
