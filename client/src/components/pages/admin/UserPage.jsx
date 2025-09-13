import ConfirmModal from "@/components/modals/ConfirmModal";
import ViewModal from "@/components/modals/ViewModal";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import userService from "@/services/userService";
import { dateFormatter } from "@/utils/dateFormatter";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Building2,
  UserCog,
  Users,
  UserCircle,
  Mail,
  Calendar,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  //Fetch All Users
  const fetchAllUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      const users = response.data || [];
      setUsers(users.users.filter((user) => user.role !== "admin"));
    } catch (error) {
      toast.error("Error in users fetching");
      console.log("Error in users fetching", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const userStats = [
    { title: "Total Users", count: users.length, icon: <Users size={18} /> },
    {
      title: "HR Members",
      count: users.filter((user) => user.role === "hr").length,
      icon: <UserCog size={18} />,
    },
    {
      title: "Management",
      count: users.filter((user) => user.role === "management").length,
      icon: <Building2 size={18} />,
    },
    {
      title: "Trainer",
      count: users.filter((user) => user.role === "trainer").length,
      icon: <Building2 size={18} />,
    },
  ];

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("fullName", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <UserCircle size={16} />
          Name
        </div>
      ),
      cell: (info) => info.getValue() || "N/A",
    }),

    columnHelper.accessor("email", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <Mail size={16} />
          Email
        </div>
      ),
      cell: (info) => info.getValue() || "N/A",
    }),

    columnHelper.accessor("role", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <ShieldCheck size={16} />
          Role
        </div>
      ),
      cell: (info) => info.getValue() || "N/A",
    }),

    columnHelper.accessor("createdAt", {
      header: () => (
        <div className="d-flex align-items-center gap-2">
          <Calendar size={16} />
          Created At
        </div>
      ),
      cell: (info) => dateFormatter(info.getValue()),
    }),

    columnHelper.accessor("status", {
      header: "Status",
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

    // columnHelper.accessor((row) => row.isverified, {
    //   id: "isVerified",
    //   header: "Verified?",
    //   enableGrouping: true,
    //   cell: (info) => (
    //     <div className="text-center w-100">
    //       {info.getValue() ? (
    //         <CheckCheck size={20} color="green" />
    //       ) : (
    //         <ShieldCheck size={20} color="red" />
    //       )}
    //     </div>
    //   ),
    // }),
  ];

  //View Modal Fields
  const fields = [
    {
      label: "ID",
      key: "_id",
    },
    {
      label: "Full Name",
      key: "fullName",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Role",
      key: "role",
    },
    {
      label: "Created At",
      key: "createdAt",
      type: "datetime",
    },
    {
      label: "Status",
      key: "status",
      type: "boolean",
    },
    {
      label: "Verified",
      key: "isverified",
      type: "boolean",
    },
  ];

  const activeUsersAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
      status: true,
    };
    try {
      await userService.updateUserStatusById(data);
      fetchAllUsers();
      toast.success("Users Activated");
    } catch (error) {
      console.log("Erorr in activeUsersAccount", error);
      toast.error("Error in activeUsersAccount");
    }
  };

  const suspendUsersAccount = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
      status: false,
    };
    try {
      await userService.updateUserStatusById(data);
      fetchAllUsers();
      toast.success("Users Suspended");
    } catch (error) {
      console.log("Erorr in suspendUsersAccount", error);
      toast.error("Error in suspendUsersAccount");
    }
  };
  const deleteUsers = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
    };
    try {
      await userService.deleteUserById(data);
      fetchAllUsers();
      toast.success("Currently It is disabled");
    } catch (error) {
      console.log("Erorr in deleteUsers", error);
      toast.error("Error in deleteUsers");
    }
  };

  return (
    <>
      <StatCard cards={userStats} />

      <DataTable
        title="All Users"
        data={users}
        columns={columns}
        showSelection={true}
        deleteButton={true}
        activeButton={true}
        suspendButton={true}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
        onActive={(rows) => activeUsersAccount(rows)}
        onSuspend={(rows) => suspendUsersAccount(rows)}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={fields}
        title={selectedRow?.fullName}
        data={selectedRow}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected Users"}
        onConfirm={() => {
          deleteUsers(selectedRow), setDeleteModal(false);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />
    </>
  );
};

export default UserPage;
