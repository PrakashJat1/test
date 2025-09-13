import React, { useEffect, useState } from "react";
import Sidebar from "@/layouts/Sidebar";
import { getSidebarMenu } from "@/utils/sideBarMenu";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import Navbar from "@/layouts/Navbar";
import DashboardLayout from "@/layouts/DashboardLayout";
import { UserPlus } from "lucide-react";
import DropdownNew from "@/components/common/UI/DropdownNew";
import FormModal from "@/components/modals/FormModal";
import FormWrapper from "@/components/common/Form/FormWrapper";
import yupSchemas from "@/utils/yupSchemas";
import SelectField from "@/components/common/Form/SelectField";
import { toast } from "react-toastify";
import batchService from "@/services/batchService";
import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import saturdaysessionService from "@/services/saturdaysessionService";
import timetableService from "@/services/timetableService";

const ManagementMainDashboard = () => {
  const user = useAuth().user;
  const menuItems = getSidebarMenu(user.role);
  const management = useUser();

  const [formvalue, setFormvalue] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [allBatches, setallBatches] = useState([]);

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      const batches = response.data;

      const formattedOptions = batches.map((batch) => ({
        label: batch.batch_Name,
        value: batch._id,
      }));

      setallBatches(formattedOptions);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("batch list is empty");
      } else toast.error("Error in fetchAllBatches");

      console.log("Error in  fetchAllBatches", error);
    }
  };

  useEffect(() => {
    fetchAllBatches();
  }, []);

  const handleAddSaturdaySession = async (data) => {
    try {
      const payLoad = {
        uploadedBy: user.userId,
        topic: data.topic,
        ExpertName: data.ExpertName,
        company: data.company,
        position: data.position,
        date: data.date,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        batchIds: data.batchIds,
      };
      console.log(payLoad);
      await saturdaysessionService.addSession(payLoad);
      toast.success("Session Added Successfully 😊");
    } catch (error) {
      toast.error("Error in Session Creation");
      console.log("Error in Session Creation", error);
    }
    finally{
      setAddModal(false)
    }
  };

  const handleAddTimeTable = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Name", data.Name);
      formData.append("batchId", data.batchId);
      formData.append("uploadedBy", user.userId);

      if (data?.timetable?.[0]) {
        formData.append("timetable", data?.timetable?.[0]); // only first file
      }
      await timetableService.addTimeTable(formData);
      toast.success(`${data.Name} Added Successfully`);
    } catch (error) {
      console.log("Erorr in handleAddTimeTable", error);
      toast.error("Error in handleAddTimeTable");
    } finally {
      setAddModal(false);
    }
  };

  const AddSaturdaySessionForm = () => (
    <FormWrapper
      defaultValues={{
        topic: "",
        ExpertName: "",
        company: "",
        position: "",
        date: "",
        timeFrom: "",
        timeTo: "",
        batchIds: "",
      }}
      onSubmit={handleAddSaturdaySession}
      schema={yupSchemas.addSaturdaySessionSchema}
    >
      <InputField
        type="text"
        name="topic"
        label="Topic*"
        placeholder="Please enter session topic"
      />
      <InputField
        type="text"
        name="ExpertName"
        label="Expert Name*"
        placeholder="Please enter Expert Name"
      />

      <InputField
        type="text"
        name="company"
        label="Company*"
        placeholder="Enter enter Company"
      />

      <InputField
        type="text"
        name="position"
        label="Position*"
        placeholder="Enter Expert Position"
      />

      <InputField type="date" name="date" label="Session Date*" />

      <InputField type="time" name="timeFrom" label="Time From*" />

      <InputField type="time" name="timeTo" label="Time To*" />

      <CheckboxGroupField
        name="batchIds"
        label="Choose Batches"
        options={allBatches}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" label="Add Session" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const AddTimeTableForm = () => (
    <FormWrapper
      defaultValues={{
        Name: "",
        batchId: "",
        timetable: "",
      }}
      schema={yupSchemas.addTimeTableSchema}
      onSubmit={handleAddTimeTable}
    >
      <InputField
        type="text"
        name="Name"
        label="Time Table Name*"
        placeholder="Please enter Time Table Name"
      />
      <SelectField name="batchId" label="Batch*" options={allBatches} />

      <InputField type="file" name="timetable" label="Choose Image*" />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
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
    switch (formvalue) {
      case "timetable":
        return <AddTimeTableForm />;
      case "session":
        return <AddSaturdaySessionForm />;
      default:
        return null;
    }
  };

  if (!management) return null;
  return (
    <>
      <DashboardLayout
        Navbar={
          <Navbar
            title={"Management Dashboard".toUpperCase()}
            fullName={management.fullName}
            button={
              <DropdownNew
                label=" New "
                options={[
                  { label: "Timetable", value: "timetable" },
                  { label: "Saturday Session", value: "session" },
                ]}
                icon={<UserPlus size={20} />}
                onSelect={(value) => {
                  fetchAllBatches();
                  setFormvalue(value);
                  setAddModal(true);
                }}
              />
            }
          />
        }
        Sidebar={<Sidebar menuItems={menuItems} />}
      />

      {formvalue !== "" && (
        <FormModal
          title={` Add ${formvalue}`}
          show={addModal}
          onClose={() => setAddModal(false)}
          formWrapper={getFormComponent()}
        />
      )}
    </>
  );
};

export default ManagementMainDashboard;
