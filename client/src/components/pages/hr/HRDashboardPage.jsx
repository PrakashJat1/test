import ViewModal from "@/components/modals/ViewModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import companyService from "@/services/companyService";
import toastmasterService from "@/services/toastmasterService";
import {
  Building2,
  CalendarClock,
  Mic2,
  CalendarDays,
  DollarSignIcon,
  Eye,
  File,
  FileText,
  Link,
  LinkIcon,
  User,
  Pencil,
  AwardIcon,
  PencilLine,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { dateFormatter } from "@/utils/dateFormatter";
import batchService from "@/services/batchService";
import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import InputField from "@/components/common/Form/InputField";
import yupSchemas from "@/utils/yupSchemas";
import FormWrapper from "@/components/common/Form/FormWrapper";
import FormModal from "@/components/modals/FormModal";
import Button from "@/components/common/UI/Button";

const HRDashboardPage = () => {
  const user = useAuth().user;

  const [companies, setCompanies] = useState([]);
  const [toastmasterSessions, setToastmasterSessions] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [currentMonthDrives, setCurrentMonthDrives] = useState([]);
  const [editCompanyFormModal, setEditCompanyFormModal] = useState(false);

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAll();

      const companies = response.data || [];
      const sortedCompanies = companies?.sort(
        (a, b) => new Date(b.driveDate) - new Date(a.driveDate)
      );
      setCompanies(sortedCompanies);
      setCurrentMonthDrives(currentMonthCompaniesDrives(sortedCompanies));
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Companies are not found");
      } else toast.error("Error in fetchCompanies");

      console.log("Error in  fetchCompanies", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await toastmasterService.getAll();
      const toastmasters = response.data || [];
      setToastmasterSessions(
        toastmasters?.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
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
      toast.error("Error in fetching fetchAllBatches");
      console.log("Error in fetching fetchAllBatches", error);
    }
  };

  function currentMonthCompaniesDrives(companies) {
    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();

    return companies.filter((drive) => {
      const driveDate = new Date(drive.driveDate);
      return (
        driveDate.getMonth() === currMonth &&
        driveDate.getFullYear() === currYear
      );
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await fetchCompanies();
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

  function getUpcomingDrive() {
    const now = new Date();
    const upcoming = companies.filter(
      (s) => new Date(s.date) > now // only future sessions
    ).length;

    return upcoming || 0;
  }

  const upcomingSessions = useMemo(() => {
    return getUpcomingSession();
  }, []);

  const upcomingDrvies = useMemo(() => {
    return getUpcomingDrive();
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
      fetchCompanies();
      toast.success(`${selectedRow?.name} Edited Successfully`);
      setSelectedRow(null);
    } catch (error) {
      console.log("Erorr in handleEditBatch", error);
      toast.error("Error in handleEditBatch");
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

  //Stats data
  const statCards = [
    {
      title: "Total Company Drives",
      count: companies?.length,
      icon: <Building2 size={18} />,
    },
    {
      title: "Upcoming Drives",
      count: upcomingDrvies,
      icon: <CalendarClock size={18} />,
    },
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

  const companyColumns = [
    {
      accessorKey: "name",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <FileText size={16} /> Name
        </div>
      ),
    },
    {
      accessorKey: "roleOffered",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Role
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-capitalize">{row.original.roleOffered}</span>
      ),
    },
    {
      accessorKey: "package",
      header: () => (
        <div className="flex items-center gap-2">
          <DollarSignIcon size={16} />
          <span>Package</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <span className="font-medium">{row.original.packageOffered}</span>
        );
      },
    },
    {
      accessorKey: "driveDate",
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{dateFormatter(row.original.driveDate)}</span>;
      },
    },
    {
      accessorKey: "websiteLink",
      header: () => (
        <div className="flex items-center gap-2">
          <Link size={16} />
          <span>Website Link</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <a
            href={row.original.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon size={18} className="text-blue-500 hover:underline" />
          </a>
        );
      },
    },
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
            setSelectedRow(row.original), setEditCompanyFormModal(true);
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

  const companiesFields = [
    { key: "name", label: "Company Name" },
    { key: "uploadedBy.fullName", label: "Added by" },
    {
      key: "driveDate",
      label: "Drive Date",
      type: "date",
    },
    {
      key: "roleOffered",
      label: "Role Offered",
    },
    {
      key: "packageOffered",
      label: "Package Offered",
    },
    {
      key: "websiteLink",
      label: "Website Link",
      type: "link",
    },
    {
      key: "roundsInfo",
      label: "Rounds Info",
    },
  ];

  return (
    <>
      <StatCard cards={statCards} />

      <DataTable
        title=" Current Month Companies Drives "
        data={currentMonthDrives}
        columns={companyColumns}
      />

      {/* Modal for company Edit */}
      <FormModal
        title={`Edit ${selectedRow?.name}`}
        show={editCompanyFormModal}
        onClose={() => setEditCompanyFormModal(false)}
        formWrapper={<EditCompanyForm />}
      />

      {/* View Modal */}
      <ViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        fields={companiesFields}
        title={selectedRow?.name}
        data={selectedRow}
      />
    </>
  );
};

export default HRDashboardPage;
