import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import bookissueService from "@/services/bookissueService";
import bookService from "@/services/bookService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import {
  Book,
  BookMinus,
  GitPullRequestArrow,
  LucideTimerReset,
  ArrowUpDown,
  Eye,
  BookOpen,
  User,
  ListChecks,
  Clock,
  CheckCircle,
  Undo2,
  XCircle,
  CalendarDays,
  Settings2,
  CalendarCheck,
  Barcode,
  Folder,
  Layers,
  ClipboardList,
  CalendarPlus,
  Pencil,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManagementBookPage = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [allIssuedBooks, setAllIssuedBooks] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewBookModal, setViewBookModal] = useState(false);
  const [viewBookIssueModal, setViewBookIssueModal] = useState(false);
  const [addBookModal, setAddBookModal] = useState(false);
  const [editBookModal, setEditBookModal] = useState(false);

  const bookStats = [
    {
      title: "Total Books",
      count: allBooks.length,
      icon: <Book size={18} />,
    },
    {
      title: "This Month",
      count: allBooks.filter((tm) => {
        const sessionDate = new Date(tm.date);
        return (
          sessionDate.getMonth() === new Date().getMonth() &&
          sessionDate.getFullYear() === new Date().getFullYear()
        );
      }).length,
      icon: <LucideTimerReset size={18} />,
    },
    {
      title: "Issued",
      count: allIssuedBooks.filter((b) => b.status === "issued").length,
      icon: <BookMinus size={18} />,
    },
    {
      title: "Pending Request",
      count: allIssuedBooks.filter((b) => b.status === "requested").length,
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
      accessorKey: "studentId.userId.fullName",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={18} /> Student
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
      accessorKey: "issuedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarDays size={18} /> Issue Date
        </div>
      ),
      cell: ({ row }) =>
        row.original.issueOn ? dateFormatter(row.original.issuedOn) : "—",
    },
    {
      accessorKey: "returnedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarCheck size={18} /> Return Date
        </div>
      ),
      cell: ({ row }) =>
        row.original.returnedOn ? dateFormatter(row.original.returnedOn) : "—",
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="d-flex justify-content-center">
          <Settings2 size={18} /> Details
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="d-flex gap-2 justify-content-center">
            <Eye
              className="text-success cursor-pointer"
              size={18}
              onClick={() => {
                setSelectedRow(row.original), setViewBookIssueModal(true);
              }}
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
          <Settings2 size={18} /> Details
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="d-flex gap-2 justify-content-center">
            <Eye
              className="text-success cursor-pointer"
              size={18}
              onClick={() => {
                setSelectedRow(row.original), setViewBookModal(true);
              }}
            />
          </div>
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
            setEditBookModal(true);
            setSelectedRow(row.original);
          }}
        >
          <Pencil size={16} />
        </button>
      ),
    },
  ];

  const bookFields = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "isbn", label: "ISBN" },
    { key: "category", label: "Category" },
    { key: "totalQty", label: "Total Quantity" },
    { key: "issuedCount", label: "Issued Count" },
    { key: "addedOn", label: "Added On", type: "date" },
  ];

  const bookIssueFields = [
    { key: "studentId.userId.fullName", label: "Student Name" },
    { key: "studentId.userId.email", label: "Student Email" },
    { key: "bookId.title", label: "Book Title" },
    { key: "requestedOn", label: "Requested On", type: "date" },
    { key: "issuedOn", label: "Issued On", type: "date" },
    { key: "dueDate", label: "Due Date", type: "date" },
    { key: "returnedOn", label: "Returned On", type: "date" },
    { key: "status", label: "Status" },
  ];

  const fetchAllBooks = async () => {
    try {
      const response = await bookService.getAll();
      setAllBooks(response.data || []);
    } catch (error) {
      toast.error("Error in fetching AllBooks");
      console.log("Error in fetching AllBooks", error);
    }
  };

  const fetchAllIssuedBooks = async () => {
    try {
      const response = await bookissueService.getAll();
      setAllIssuedBooks(response.data || []);
    } catch (error) {
      toast.error("Error in fetching IssuedBooks");
      console.log("Error in fetching IssuedBooks", error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
    fetchAllIssuedBooks();
  }, []);

  const approveBooksIssueRequest = async (rows) => {
    setSelectedRow([]);
    const isAlreadyIssuedOrReturned = rows.some(
      (b) => b.status === "issued" || b.status === "returned"
    );

    if (isAlreadyIssuedOrReturned) {
      return toast.warn("Any of the book is already issued or returned");
    }

    const ids = rows.map((r) => r._id);

    const data = {
      ids,
      status: "issued",
    };
    try {
      await bookissueService.approveBooksIssueRequest(data);
      fetchAllBooks();
      fetchAllIssuedBooks();
      toast.success("Book Issued successfully");
    } catch (error) {
      console.log("Erorr in approveBooksIssueRequest", error);
      toast.error("Error in approveBooksIssueRequest");
    }
  };

  const rejectBooksIssueRequest = async (rows) => {
    setSelectedRow([]);
    const isAlreadyIssuedOrReturned = rows.some(
      (b) => b.status === "issued" || b.status === "returned"
    );

    if (isAlreadyIssuedOrReturned) {
      return toast.warn("Any of the book is already issued or returned");
    }

    const ids = rows.map((r) => r._id);

    const data = {
      ids,
      status: "rejected",
    };
    try {
      await bookissueService.rejectBooksIssueRequest(data);
      fetchAllBooks();
      fetchAllIssuedBooks();
      toast.success("Request rejected successfully");
    } catch (error) {
      console.log("Erorr in rejectBooksIssueRequest", error);
      toast.error("Error in rejectBooksIssueRequest");
    }
  };

  const handleAddBook = async (data) => {
    try {
      const payLoad = {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        totalQty: data.totalQty,
      };
      await bookService.addBook(payLoad);
      toast.success(`${data.title} Added Successfully`);
    } catch (error) {
      console.log("Erorr in handleAddBook", error);
      toast.error("Error in handleAddBook");
    } finally {
      fetchAllBooks();
      setSelectedRow(null);
      setAddBookModal(false);
    }
  };

  const handleEditBook = async (data) => {
    try {
      const payLoad = {
        id: selectedRow._id,
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        category: data.category,
        totalQty: data.totalQty,
      };
      await bookService.editBook(payLoad);
      toast.success(`${data.title} Edited Successfully`);
    } catch (error) {
      console.log("Erorr in handleEditBook", error);
      toast.error("Error in handleEditBook");
    } finally {
      fetchAllBooks();
      setSelectedRow(null);
      setEditBookModal(false);
    }
  };

  const EditBookForm = () => (
    <FormWrapper
      defaultValues={{
        title: selectedRow?.title,
        author: selectedRow?.author,
        isbn: selectedRow?.isbn,
        category: selectedRow?.category,
        totalQty: selectedRow?.totalQty,
      }}
      schema={yupSchemas.addBookSchema}
      onSubmit={handleEditBook}
    >
      <InputField
        type="text"
        name="title"
        label="Book Title*"
        placeholder="Please enter Book Title"
      />
      <InputField
        type="text"
        name="author"
        label="Author*"
        placeholder="Please enter Author"
      />

      <InputField
        type="text"
        name="isbn"
        label="ISBN*"
        placeholder="Please enter unique ISBN Number"
      />

      <InputField
        type="text"
        name="category"
        label="Category*"
        placeholder="Please Enter Category"
      />

      <InputField
        type="number"
        name="totalQty"
        label="Total Quantity*"
        placeholder="Please Enter Total Quantity"
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditBookModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const AddBookForm = () => (
    <FormWrapper
      defaultValues={{
        title: "",
        author: "",
        isbn: "",
        category: "",
        totalQty: "",
      }}
      schema={yupSchemas.addBookSchema}
      onSubmit={handleAddBook}
    >
      <InputField
        type="text"
        name="title"
        label="Book Title*"
        placeholder="Please enter Book Title"
      />
      <InputField
        type="text"
        name="author"
        label="Author*"
        placeholder="Please enter Author"
      />

      <InputField
        type="text"
        name="isbn"
        label="ISBN*"
        placeholder="Please enter unique ISBN Number"
      />

      <InputField
        type="text"
        name="category"
        label="Category*"
        placeholder="Please Enter Category"
      />

      <InputField
        type="number"
        name="totalQty"
        label="Total Quantity*"
        placeholder="Please Enter Total Quantity"
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddBookModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      <StatCard cards={bookStats} />

      <DataTable
        title=" All Issued Books "
        data={allIssuedBooks}
        columns={issuedBookColumns}
        showSelection={true}
        approveButton={true}
        rejectButton={true}
        onApprove={(rows) => approveBooksIssueRequest(rows)}
        onReject={(rows) => rejectBooksIssueRequest(rows)}
      />

      <DataTable
        title=" All Books "
        data={allBooks}
        columns={bookColumns}
        addButton="true"
        onAdd={() => setAddBookModal(true)}
      />

      {/* View Issued Books Modal */}
      <ViewModal
        show={viewBookIssueModal}
        onClose={() => setViewBookIssueModal(false)}
        fields={bookIssueFields}
        title={selectedRow?.bookId?.title}
        data={selectedRow}
      />

      {/* View Books Modal */}
      <ViewModal
        show={viewBookModal}
        onClose={() => setViewBookModal(false)}
        fields={bookFields}
        title={selectedRow?.title}
        data={selectedRow}
      />

      {/* Edit Book Form */}
      <FormModal
        title={`Edit ${selectedRow?.title}`}
        show={editBookModal}
        onClose={() => {
          setEditBookModal(false);
          setSelectedRow(null);
        }}
        formWrapper={<EditBookForm />}
      />

      {/* Add book Form */}
      <FormModal
        title={`Add new Book`}
        show={addBookModal}
        onClose={() => {
          setAddBookModal(false), setSelectedRow(null);
        }}
        formWrapper={<AddBookForm />}
      />
    </>
  );
};

export default ManagementBookPage;
