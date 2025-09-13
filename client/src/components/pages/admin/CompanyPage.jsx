import React, { useEffect, useState } from "react";
import {
  Book,
  BookMinus,
  LucideTimerReset,
  GitPullRequestArrow,
  Briefcase,
  User,
  Globe,
  Calendar,
  FileText,
  Eye,
  Pencil,
  AwardIcon,
} from "lucide-react";
import StatCard from "@/layouts/StatCard";
import DataTable from "@/layouts/DataTable";
import ViewModal from "@/components/modals/ViewModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import companyService from "@/services/companyService";
import { toast } from "react-toastify";
import { createColumnHelper } from "@tanstack/react-table";
import { dateFormatter } from "@/utils/dateFormatter";
import FormModal from "@/components/modals/FormModal";
import FormWrapper from "@/components/common/Form/FormWrapper";
import yupSchemas from "@/utils/yupSchemas";
import Button from "@/components/common/UI/Button";
import InputField from "@/components/common/Form/InputField";
import useAuth from "@/hooks/useAuth";
import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import batchService from "@/services/batchService";

const CompanyPage = () => {
  const { user } = useAuth();

  const [allCompanies, setAllCompanies] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addCompanyModal, setAddCompanyModal] = useState(false);
  const [editCompanyFormModal, setEditCompanyFormModal] = useState(false);

  const companyStats = [
    {
      title: "Total Companies",
      count: allCompanies.length,
      icon: <Book size={18} />,
    },
    {
      title: "Upcoming Drives",
      count: allCompanies.filter((c) => new Date(c.driveDate) > new Date())
        .length,
      icon: <BookMinus size={18} />,
    },
    {
      title: "Highest Package Offered",
      count:
        allCompanies.length > 0
          ? Math.max(
              ...allCompanies.map((c) => parseFloat(c.packageOffered) || 0)
            ) + " LPA"
          : 0,
      icon: <LucideTimerReset size={18} />,
    },
    {
      title: "Students Placed",
      count: 0,
      icon: <GitPullRequestArrow size={18} />,
    },
  ];

  const columnHelper = createColumnHelper();

  const companyColumns = [
    columnHelper.accessor("name", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Briefcase size={16} /> Company
        </div>
      ),
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("roleOffered", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Role Offered
        </div>
      ),
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("packageOffered", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Package
        </div>
      ),
      cell: (info) => `${info.getValue() || "-"}`,
    }),
    columnHelper.accessor("driveDate", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Calendar size={16} /> Drive Date
        </div>
      ),
      cell: (info) => (info.getValue() ? dateFormatter(info.getValue()) : "-"),
    }),
    columnHelper.accessor("websiteLink", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Globe size={16} /> Website
        </div>
      ),
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        ) : (
          "-"
        );
      },
    }),
    columnHelper.accessor("roundsInfo", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Rounds Info
        </div>
      ),
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("uploadedBy.fullName", {
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Uploaded By
        </div>
      ),
      cell: (info) => info.getValue() || "-",
    }),
    {
      accessorKey: "batchIds",
      header: () => (
        <div className="flex items-center gap-2">
          <AwardIcon size={16} />
          <span>For Batches</span>
        </div>
      ),
      cell: ({ row }) => {
        const batches = row.original.batchIds;
        return (
          <span>
            {batches
              .sort((a, b) => a.batch_No - b.batch_No)
              .map((b) => b.batch_Name)
              .join(", ")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Edit",
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setSelectedRow(row.original), setEditCompanyFormModal(true);
          }}
        >
          <Pencil size={16} className="me-1" />
        </button>
      ),
    },
    columnHelper.display({
      id: "details",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Eye size={16} /> Details
        </div>
      ),
      cell: ({ row }) => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setSelectedRow(row.original), setViewModal(true);
          }}
        >
          <Eye size={14} />
        </button>
      ),
    }),
  ];

  const companyFields = [
    { key: "name", label: "Company Name" },
    { key: "roleOffered", label: "Role Offered" },
    { key: "packageOffered", label: "Package Offered (LPA)" },
    { key: "driveDate", label: "Drive Date", type: "date" },
    { key: "websiteLink", label: "Website", type: "image" },
    { key: "roundsInfo", label: "Rounds Info" },
    { key: "uploadedBy.fullName", label: "Uploaded By" },
  ];

  const fetchAllCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setAllCompanies(response.data || []);
    } catch (error) {
      toast.error("Error in fetching AllCompanies");
      console.log("Error in fetching AllCompanies", error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      setAllBatches(response.data || []);
    } catch (error) {
      toast.error("Error in fetching fetchAllBatches");
      console.log("Error in fetching fetchAllBatches", error);
    }
  };

  useEffect(() => {
    fetchAllCompanies();
    fetchAllBatches();
  }, []);

  const handleEditCompany = async (data) => {
    try {
      const batchIds = allBatches
        .filter((b) => data.batchIds.includes(b._id))
        .map((b) => b._id);

      const payLoad = {
        id: selectedRow._id,
        name: data.name,
        roleOffered: data.roleOffered,
        packageOffered: data.packageOffered,
        driveDate: data.driveDate,
        websiteLink: data.websiteLink.trim(),
        roundsInfo: data.roundsInfo,
        batchIds: batchIds,
      };

      await companyService.editCompany(payLoad);
      fetchAllCompanies();
      toast.success(`${selectedRow?.name} Edited Successfully`);
      setSelectedRow(null);
    } catch (error) {
      console.log("Erorr in handleEditBatch", error);
      toast.error("Error in handleEditBatch");
    } finally {
      setEditCompanyFormModal(false);
    }
  };

  const handleAddCompany = async (data) => {
    try {
      const payLoad = {
        id: user?.userId,
        name: data.name,
        roleOffered: data.roleOffered,
        packageOffered: data.packageOffered,
        driveDate: data.driveDate,
        websiteLink: data.websiteLink.trim(),
        roundsInfo: data.roundsInfo,
        batchIds: data.batchIds,
      };

      console.log(payLoad);
      await companyService.addCompany(payLoad);
      fetchAllCompanies();
      toast.success(`${data.name} Added Successfully`);
      setSelectedRow(null);
    } catch (error) {
      console.log("Erorr in handleAddCompany", error);
      toast.error("Error in handleAddCompany");
    } finally {
      setEditCompanyFormModal(false);
    }
  };

  const EditCompanyForm = () => (
    <FormWrapper
      defaultValues={{
        name: selectedRow?.name,
        roleOffered: selectedRow?.roleOffered,
        packageOffered: selectedRow?.packageOffered,
        driveDate: selectedRow?.driveDate?.slice(0, 10),
        websiteLink: selectedRow?.websiteLink,
        roundsInfo: selectedRow?.roundsInfo,
        batchIds: selectedRow?.batchIds,
      }}
      schema={yupSchemas.CompanyEditSchema}
      onSubmit={handleEditCompany}
    >
      <InputField
        type="text"
        name="name"
        label="Company Name*"
        placeholder="Please enter company name"
      />
      <InputField
        type="text"
        name="roleOffered"
        label="Role Offered*"
        placeholder="Please enter Role"
      />

      <InputField
        type="text"
        name="packageOffered"
        label="Package Offered*"
        placeholder="Enter Offered Package"
      />

      <InputField type="date" name="driveDate" label="Drive Date" />

      <InputField
        type="text"
        name="websiteLink"
        label="Website Link*"
        placeholder="Enter Website Link"
      />

      <InputField
        type="text"
        name="roundsInfo"
        label="Rounds Info*"
        placeholder="Enter Rounds Info"
      />

      <CheckboxGroupField
        name="batchIds"
        label="Remove Bathes"
        options={allBatches.map((b) => ({
          label: b?.batch_Name,
          value: b?._id,
        }))}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditCompanyFormModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const AddCompanyForm = () => (
    <FormWrapper
      defaultValues={{
        name: selectedRow?.name,
        roleOffered: selectedRow?.roleOffered,
        packageOffered: selectedRow?.packageOffered,
        driveDate: selectedRow?.driveDate?.slice(0, 10),
        websiteLink: selectedRow?.websiteLink,
        roundsInfo: selectedRow?.roundsInfo,
        batchIds: selectedRow?.batchIds,
      }}
      schema={yupSchemas.CompanyEditSchema}
      onSubmit={handleAddCompany}
    >
      <InputField
        type="text"
        name="name"
        label="Company Name*"
        placeholder="Please enter company name"
      />
      <InputField
        type="text"
        name="roleOffered"
        label="Role Offered*"
        placeholder="Please enter Role"
      />

      <InputField
        type="text"
        name="packageOffered"
        label="Package Offered*"
        placeholder="Enter Offered Package"
      />

      <InputField type="date" name="driveDate" label="Drive Date" />

      <InputField
        type="text"
        name="websiteLink"
        label="Website Link*"
        placeholder="Enter Website Link"
      />

      <InputField
        type="text"
        name="roundsInfo"
        label="Rounds Info*"
        placeholder="Enter Rounds Info"
      />

      <CheckboxGroupField
        name="batchIds"
        label="Select Bathes"
        options={allBatches.map((b) => ({
          label: b.batch_Name,
          value: b._id,
        }))}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddCompanyModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const deleteCompanies = async (rows) => {
    setSelectedRow([]);
    const ids = rows.map((row) => row._id);
    const data = {
      ids,
    };
    try {
      await companyService.deleteCompanies(data);
      toast.success("Companies Deleted successfully");
    } catch (error) {
      console.log("Erorr in deleteAllCompanies", error);
      toast.error("Error in deleteAllCompanies");
    } finally {
      fetchAllCompanies();
      setDeleteModal(false);
    }
  };

  return (
    <>
      <StatCard cards={companyStats} />

      <DataTable
        title=" All Companies "
        data={allCompanies}
        columns={companyColumns}
        showSelection={true}
        deleteButton="true"
        addButton="true"
        onAdd={() => {
          setSelectedRow(null), setAddCompanyModal(true);
        }}
        onDelete={(rows) => {
          setSelectedRow(rows), setDeleteModal(true);
        }}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={companyFields}
        title={selectedRow?.name}
        data={selectedRow}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        show={deleteModal}
        title={"Confirm Deletion"}
        message={"Do you want to permanently delete selected Companies"}
        onConfirm={() => {
          deleteCompanies(selectedRow),
            setDeleteModal(false),
            setSelectedRow(null);
        }}
        onClose={() => {
          setDeleteModal(false), setSelectedRow(null);
        }}
      />

      {/* Modal for company Edit */}
      <FormModal
        title={`Edit ${selectedRow?.name}`}
        show={editCompanyFormModal}
        onClose={() => setEditCompanyFormModal(false)}
        formWrapper={<EditCompanyForm />}
      />

      {/* Add Company Modal */}
      <FormModal
        title={`Add new Company Details`}
        show={addCompanyModal}
        onClose={() => setAddCompanyModal(false)}
        formWrapper={<AddCompanyForm />}
      />
    </>
  );
};

export default CompanyPage;
