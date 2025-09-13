import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/layouts/DataTable";
import StatCard from "@/layouts/StatCard";
import pdfService from "@/services/pdfService";
import trainerService from "@/services/trainerService";
import { dateFormatter } from "@/utils/dateFormatter";
import yupSchemas from "@/utils/yupSchemas";
import {
  CalendarCheck,
  Eye,
  FileCode2,
  Link2Icon,
  Pencil,
  PencilIcon,
  TargetIcon,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TrainerPDFpage = () => {
  const user = useAuth().user;
  const [trainer, setTrainer] = useState(null);
  const [allPDF, setAllPDF] = useState([]);

  const [selectedRow, setSelectedRow] = useState([]);
  const [editPDFModal, setEditPDFModal] = useState(false);

  const fetchTrainer = async () => {
    try {
      const response = await trainerService.getTrainerByUserId(user.userId);
      setTrainer(response.data || []);
      return response.data || []
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Trainer is not found");
      } else toast.error("Error in fetchTrainer");

      console.log("Error in  fetchTrainer", error);
    }
  };

  const fetchAllPDFs = async (trainer) => {
    try {
      const response = await pdfService.getAllPDFByTrainerId(trainer._id);
      setAllPDF(response.data || []);
    } catch (error) {
      toast.error("Error in fetching fetchAllPDFs");
      console.log("Error in fetching fetchAllPDFs", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainer = await fetchTrainer();
        fetchAllPDFs(trainer);
      } catch (error) {
        console.log("Error in useEffect", error);
      }
    };
    fetchData();
  }, []);

  //Stats data
  const pdfStatCards = [
    {
      title: "Total PDF",
      count: allPDF.length,
      icon: <FileCode2 size={18} />,
    },
  ];

  const PDFsColumns = [
    {
      accessorKey: "title",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <User size={16} /> Title
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.title}</span>;
      },
    },
    {
      accessorKey: "fileType",
      header: () => (
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Type</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.fileType}</span>;
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
            {row.original.targetBatchIds?.map((b) => b.batch_Name + " ")}
          </span>
        );
      },
    },

    {
      accessorKey: "fileLink",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Link2Icon size={16} /> Open
        </div>
      ),
      cell: ({ row }) => (
        <a target="_blank" href={row.original.fileLink?.secure_id}>
          <Eye size={18} />
        </a>
      ),
    },

    {
      accessorKey: "uploadedOn",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <CalendarCheck size={16} /> Submitted On
        </div>
      ),
      cell: ({ row }) => dateFormatter(row.original.uploadedOn),
    },

    {
      accessorKey: "editpdf",
      header: () => (
        <div className="d-flex align-items-center gap-1">
          <Pencil size={16} />
          Edit
        </div>
      ),
      cell: ({ row }) => (
        <>
          <PencilIcon
            size={14}
            className="me-1"
            onClick={() => {
              setSelectedRow(row.original), setEditPDFModal(true);
            }}
          />
        </>
      ),
    },
  ];

  const handleEditPDF = async (data) => {
    try {
      const payLoad = {
        id: selectedRow._id,
        title: data.title,
        targetBatchIds: data.targetBatchIds,
      };
      // console.log(payLoad);
      await pdfService.updatePDF(payLoad);
      toast.success("PDF Updated");
      fetchAllPDFs(trainer);
    } catch (error) {
      toast.error("Error in handleEditPDF");
      console.log("Error in handleEditPDF", error);
    } finally {
      setEditPDFModal(false);
    }
  };

  const EditPDFForm = () => (
    <FormWrapper
      defaultValues={{
        title: selectedRow?.title || "",
        targetBatchIds: "",
      }}
      schema={yupSchemas.pdfEditSchema}
      onSubmit={handleEditPDF}
    >
      <InputField name="title" label="Title" placeholder="Enter the title" />

      <CheckboxGroupField
        name="targetBatchIds"
        label="Target batches"
        options={trainer?.assigned_Batches?.map((batch) => ({
          label: batch.batch_Name,
          value: batch._id,
        }))}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Update" />
        <button
          className="btn btn-secondary"
          onClick={() => setEditPDFModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  return (
    <>
      {trainer && <StatCard cards={pdfStatCards} />}
      {trainer && (
        <DataTable title="All PDF " data={allPDF} columns={PDFsColumns} />
      )}

      <FormModal
        show={editPDFModal}
        onClose={() => {
          setSelectedRow(null), setEditPDFModal(false);
        }}
        title={`${selectedRow?.title}`}
        formWrapper={<EditPDFForm />}
      />
    </>
  );
};

export default TrainerPDFpage;
