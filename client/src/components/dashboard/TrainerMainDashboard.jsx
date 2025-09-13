import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import DropdownNew from "@/components/common/UI/DropdownNew";
import AssessmentFormModal from "@/components/modals/AssessmentFormModal";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import Navbar from "@/layouts/Navbar";
import Sidebar from "@/layouts/Sidebar";
import assessmentService from "@/services/assessmentService";
import pdfService from "@/services/pdfService";
import trainerService from "@/services/trainerService";
import { monthOptions } from "@/utils/monthFormatter";
import { getSidebarMenu } from "@/utils/sideBarMenu";
import yupSchemas from "@/utils/yupSchemas";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TrainerMainDashboard = () => {
  const user = useAuth().user;
  const menuItems = getSidebarMenu(user.role);

  const [trainer, setTrainer] = useState(null);
  const [formValue, setFormValue] = useState("");
  const [addModal, setAddModal] = useState(false);

  const [createdAssessment, setCreatedAssessment] = useState(null);
  const [editAssessmentModal, setEditAssessmentModal] = useState(false);

  const fetchTrainer = async () => {
    try {
      const response = await trainerService.getTrainerByUserId(user.userId);
      setTrainer(response.data);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Trainer is not found");
      } else toast.error("Error in fetchTrainer");

      console.log("Error in  fetchTrainer", error);
    }
  };

  useEffect(() => {
    fetchTrainer();
  }, []);

  const handleCreateAssesment = async (data) => {
    try {
      data.trainerId = trainer._id;
      const response = await assessmentService.createAssessment(data);
      setCreatedAssessment(response.data);
      setEditAssessmentModal(true);
      toast.success("Assessment Created");
    } catch (error) {
      if (error.response.status === 409) toast.warning(error.response.data);
      else toast.error("Error in handleCreateAssesment");
      console.log("Error in handleCreateAssesment", error);
    } finally {
      setAddModal(false);
    }
  };

  const handleAddPDF = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key !== "pdf") formData.append(key, data[key]);
      }

      formData.append("pdf", data.pdf[0]);
      await pdfService.addPDF(formData, trainer._id);
      toast.success("PDF uploaded");
    } catch (error) {
      toast.error("Error in handle add PDF");
      console.log("Error in handle Add PDF", error);
    } finally {
      setAddModal(false);
    }
  };

  const AddAssessmentForm = () => (
    <FormWrapper
      defaultValues={{ batchId: "" }}
      schema={yupSchemas.createAssessmentSchema}
      onSubmit={handleCreateAssesment}
    >
      <InputField
        name="title"
        label="Title"
        type="text"
        placeholder="Enter title"
      />
      <SelectField
        name="batchId"
        label="Select Batch"
        options={trainer?.assigned_Batches.map((batch) => ({
          label: batch.batch_Name,
          value: batch._id,
        }))}
      />

      <SelectField name="month" label="Select Month" options={monthOptions} />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Create Assessment" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const AddPDFForm = () => (
    <FormWrapper
      defaultValues={{
        title: "",
        fileType: "",
        targetBatchIds: "",
        pdf: "",
      }}
      schema={yupSchemas.addPDFSchema}
      onSubmit={handleAddPDF}
    >
      <InputField
        type="text"
        name="title"
        label="Title"
        placeholder="Enter title of pdf"
      />

      <SelectField
        name="fileType"
        label="Choose type of PDF"
        options={[
          { label: "Notes", value: "notes" },
          { label: "Assignment", value: "assignment" },
          { label: "Interview Question", value: "interview-question" },
        ]}
      />

      <CheckboxGroupField
        name="targetBatchIds"
        label="Choose Batches"
        options={trainer?.assigned_Batches.map((batch) => ({
          label: batch.batch_Name,
          value: batch._id,
        }))}
      />

      <InputField type="file" name="pdf" label="PDF" />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Add" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const getFormComponent = () => {
    switch (formValue) {
      case "assessment":
        return <AddAssessmentForm />;

      case "pdf":
        return <AddPDFForm />;
      default:
        return null;
    }
  };

  const updateAssessmentMarks = async (data) => {
    const marks = data.map((mark) => ({
      studentId: mark.studentId,
      score: mark.marks,
      feedback: mark.feedback,
    }));
    const payLoad = {
      assessmentId: createdAssessment._id,
      marks,
    };

    try {
      const response = await assessmentService.updateAssessmentMarks(payLoad);
      setCreatedAssessment(response.data);
      toast.success("Assessment Updated Successfully");
    } catch (error) {
      toast.error("Error in updateAssessmentMarks");
      console.error("Error in updateAssessmentMarks", error);
    }
  };

  return (
    <>
      {trainer && (
        <DashboardLayout
          Navbar={
            <Navbar
              title={`${user.role} Trainer Dashboard`.toUpperCase()}
              fullName={trainer?.userId?.fullName}
              button={
                <DropdownNew
                  label=" Add"
                  options={[
                    { label: "Assessment", value: "assessment" },
                    { label: "PDF", value: "pdf" },
                  ]}
                  icon={<PlusCircle size={20} />}
                  onSelect={(value) => {
                    setFormValue(value);
                    setAddModal(true);
                  }}
                />
              }
            />
          }
          Sidebar={<Sidebar menuItems={menuItems} />}
        />
      )}

      {formValue !== "" && (
        <FormModal
          title={"New"}
          show={addModal}
          onClose={() => setAddModal(false)}
          formWrapper={getFormComponent()}
        />
      )}

      {editAssessmentModal && createdAssessment && (
        <AssessmentFormModal
          show={editAssessmentModal}
          onClose={() => setEditAssessmentModal(false)}
          assessment={createdAssessment}
          onSave={(marks) => {
            updateAssessmentMarks(marks);
          }}
        />
      )}
    </>
  );
};

export default TrainerMainDashboard;
