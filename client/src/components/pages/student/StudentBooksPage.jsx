import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import bookissueService from "@/services/bookissueService";
import bookService from "@/services/bookService";
import studentService from "@/services/studentService";
import { dateFormatter } from "@/utils/dateFormatter";
import {
  BookCheck,
  BookCopyIcon,
  LockOpen,
  User,
  Book,
  GitPullRequestArrow,
  ArrowUpDown,
  BookOpen,
  ListChecks,
  Clock,
  CheckCircle,
  Undo2,
  XCircle,
  Settings2,
  Barcode,
  Folder,
  Layers,
  ClipboardList,
  CalendarPlus,
  ClipboardCopy,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentBooksPage = () => {
  const user = useAuth().user;

  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksIssued, setBookIssued] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

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

  const fetchAllBooks = async () => {
    try {
      const response = await bookService.getAll();
      setBooks(response.data || []);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Books is not found");
      } else toast.error("Error in fetchAllBooks");

      console.log("Error in  fetchAllBooks", error);
    }
  };

  const fetchBookIssued = async (id) => {
    try {
      const response = await bookissueService.getIssueRequestByStudentId(id);
      setBookIssued(response.data || []);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("BookIssued is not found");
      } else toast.error("Error in fetchBookIssued");

      console.log("Error in  fetchBookIssued", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await fetchStudent();
      if (student) {
        await fetchBookIssued(student._id);
        await fetchAllBooks();
      }
    };

    fetchData();
  }, []);

  const bookIssueRequest = async (book) => {
    try {
      await bookService.issueRequestByStudent(student._id, book._id);
      toast.success("Reqiest Sent fetched successfully");
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Book is not found");
      } else toast.error("Error in bookIssueRequest");

      console.log("Error in  bookIssueRequest", error);
    } finally {
      fetchBookIssued(student._id);
    }
  };

  const returnBook = async (issuedBook) => {
    try {
      if (issuedBook.status === "returned")
        return toast.warn("Book Already Retured");
      else if (issuedBook.status === "rejected") {
        return toast.warn("Issue Request Already Rejected");
      }

      const payLoad = {
        id: issuedBook._id,
        status: "returned",
      };

      await bookissueService.updateIssueRequest(payLoad);
      toast.success("Book returned successfully");
      fetchBookIssued(student._id);
      fetchAllBooks();
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Books is not found");
      } else toast.error("Error in fetchAllBooks");

      console.log("Error in  fetchAllBooks", error);
    }
  };

  //Stats data
  const statCards = [
    {
      title: " Total ",
      count: books.length,
      icon: <BookCopyIcon size={18} />,
    },
    {
      title: " Issued By Me ",
      count: booksIssued.length,
      icon: <BookCheck size={18} />,
    },
    {
      title: "Pending Request",
      count: booksIssued.filter((b) => b.status === "requested").length,
      icon: <GitPullRequestArrow size={18} />,
    },
  ];

  const issuedBookColumns = [
    {
      accessorKey: "bookId.title",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <BookOpen size={18} /> Book
        </div>
      ),
    },
    {
      accessorKey: "bookId.author",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={18} /> Author
        </div>
      ),
    },
    {
      accessorKey: "bookId.isbn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Barcode size={18} /> ISBN
        </div>
      ),
    },
    {
      accessorKey: "bookId.category",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Folder size={18} /> Category
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <ListChecks size={18} /> Status
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap = {
          requested: { color: "orange", icon: <Clock size={16} /> },
          issued: { color: "green", icon: <CheckCircle size={16} /> },
          returned: { color: "blue", icon: <Undo2 size={16} /> },
          rejected: { color: "red", icon: <XCircle size={16} /> },
        };
        const { color } = statusMap[status] || {};
        return (
          <div className="d-flex justify-content-center">
            <span className={`d-flex align-items-center gap-1 text-${color}`}>
              {status.toUpperCase()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "requestedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarPlus size={18} /> Requested On
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.requestedOn),
    },
    {
      accessorKey: "returnedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarPlus size={18} /> Returned On
        </div>
      ),
      cell: ({ row }) =>
        dateFormatter(row.original.returnedOn) !== "Invalid Date"
          ? dateFormatter(row.original.returnedOn)
          : "-",
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="d-flex justify-content-center">
          <Settings2 size={18} /> Return
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="d-flex gap-2 justify-content-center">
            <ClipboardCopy
              className="text-success cursor-pointer"
              size={18}
              onClick={() => returnBook(row.original)}
            />
          </div>
        );
      },
    },
  ];

  const bookColumns = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div
          className="d-flex align-items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Book size={18} /> Title <ArrowUpDown size={16} />
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={18} /> Author
        </div>
      ),
    },
    {
      accessorKey: "isbn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Barcode size={18} /> ISBN
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Folder size={18} /> Category
        </div>
      ),
    },
    {
      accessorKey: "totalQty",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Layers size={18} /> Total Qty
        </div>
      ),
    },
    {
      accessorKey: "issuedCount",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <ClipboardList size={18} /> Issued
        </div>
      ),
    },
    {
      accessorKey: "addedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarPlus size={18} /> Added On
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.addedOn),
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="d-flex justify-content-center">
          <LockOpen size={18} /> Issue Request
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="d-flex gap-2 justify-content-center">
            <ClipboardCopy
              className="text-success cursor-pointer"
              size={18}
              onClick={() => {
                setSelectedRow(row.original), bookIssueRequest(row.original);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <StatCard cards={statCards} />

      <DataTable
        title=" Books Issued By Me  "
        data={booksIssued}
        columns={issuedBookColumns}
      />

      <DataTable title=" All Books " data={books} columns={bookColumns} />
    </>
  );
};

export default StudentBooksPage;
