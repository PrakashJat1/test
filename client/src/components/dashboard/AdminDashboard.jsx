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
import userService from "@/services/userService";
import trainerService from "@/services/trainerService";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";

const AdminDashboard = () => {
  const user = useAuth().user;
  const menuItems = getSidebarMenu(user.role);
  const admin = useUser();

  const [userRole, setUserRole] = useState("");
  const [formTitle, setFromTitle] = useState("");
  const [adduserModal, setAddUserModal] = useState(false);
  const [nonAssignedbatches, setNonAssignedbatches] = useState([]);
  const [allBatches, setallBatches] = useState([]);

  // inside AdminDashboard component
  useEffect(() => {
    switch (userRole) {
      case "hr":
        setFromTitle("Add HR");
        break;
      case "management":
        setFromTitle("Add Management Staff");
        break;
      case "trainer":
        setFromTitle("Add Trainer");
        break;
      default:
        setFromTitle("");
    }
  }, [userRole]);

  //Add user
  const nonAssignedbatchesbyTypeOfTrainer = async (type_Of_Trainer) => {
    if (!type_Of_Trainer) return toast.error("Please choose type of trainer");

    try {
      const response = await batchService.nonAssignedbatchesbyTypeOfTrainer(
        type_Of_Trainer
      );
      console.log(response.data || []);
      // setNonAssignedbatches([]);
      toast.success("Non Assigned Batches fetched Successfully");
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn(`All batches assigned for ${type_Of_Trainer}`);
      } else toast.error("Error in Fetching nonAssignedbatchesbyTypeOfTrainer");

      console.log("Error in Fetching nonAssignedbatchesbyTypeOfTrainer", error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      const batches = response.data || [];

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

  const handleSubmit = async (data) => {
    try {
      const payLoad = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        mobileNo: data.mobileNo,
        role: userRole,
      };

      switch (userRole) {
        case "hr":
          await userService.createUser(payLoad);
          break;

        case "management":
          await userService.createUser(payLoad);
          break;

        case "trainer":
          payLoad.type_Of_Trainer = data.type_Of_Trainer;
          payLoad.assigned_Batches = data.assigned_Batches;
          payLoad.specialization = data.specialization;

          await trainerService.addTrainer(payLoad);
          break;

        default:
          toast.error("Invalid Selected Role");
          return;
      }

      toast.success("User Added Successfully 😊");
    } catch (error) {
      toast.error("Error in User Creation");
      console.log("Error in User Creation", error);
    } finally {
      setAddUserModal(false);
    }
  };

  const UserFORM = () => (
    <FormWrapper
      defaultValues={{
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
      }}
      onSubmit={handleSubmit}
      schema={yupSchemas.addUserSchema}
    >
      <InputField
        type="text"
        name="fullName"
        label="fullName*"
        placeholder="Please enter your fullName"
      />
      <InputField
        type="email"
        name="email"
        label="Email*"
        placeholder="Please enter your email"
      />

      <InputField
        type="password"
        name="password"
        label="Password*"
        placeholder="Enter Strong Password"
      />

      <InputField
        type="password"
        name="confirmPassword"
        label="Confirm Password*"
        placeholder="Enter Confirm Password"
      />

      <InputField
        type="number"
        name="mobileNo"
        label="Mobile No*"
        placeholder="Enter your mobile number"
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddUserModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const TrainerFORM = () => (
    <FormWrapper
      defaultValues={{
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
        type_Of_Trainer: "",
        assigned_Batches: [],
        specialization: "",
      }}
      onSubmit={handleSubmit}
      schema={yupSchemas.addTrainerSchema}
    >
      <InputField
        type="text"
        name="fullName"
        label="fullName*"
        placeholder="Please enter your fullName"
      />
      <InputField
        type="email"
        name="email"
        label="Email*"
        placeholder="Please enter your email"
      />

      <InputField
        type="password"
        name="password"
        label="Password*"
        placeholder="Enter Strong Password"
      />

      <InputField
        type="password"
        name="confirmPassword"
        label="Confirm Password*"
        placeholder="Enter Confirm Password"
      />

      <InputField
        type="number"
        name="mobileNo"
        label="Mobile No*"
        placeholder="Enter your mobile number"
      />

      <SelectField
        name="type_Of_Trainer"
        label="Type Of Trainer"
        // onChange={(value) => nonAssignedbatchesbyTypeOfTrainer(value)}
        options={[
          { label: "Technical", value: "technical" },
          { label: "Soft Skill", value: "softskill" },
          { label: "Aptitude", value: "aptitude" },
        ]}
      />

      <InputField
        type="text"
        name="specialization"
        label="Specialization*"
        placeholder="Enter specialization of trainer"
      />

      <CheckboxGroupField
        name="assigned_Batches"
        label="Non Assigned Batches"
        options={allBatches}
      />

      <div className="d-flex justify-content-around">
        <Button type="submit" />
        <button
          className="btn btn-secondary"
          onClick={() => setAddUserModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const getFormComponent = () => {
    switch (userRole) {
      case "hr":
        return <UserFORM />;
      case "management":
        return <UserFORM />;
      case "trainer":
        return <TrainerFORM />;
      default:
        return null;
    }
  };

  if (!admin) return null;
  return (
    <>
      <DashboardLayout
        Navbar={
          <Navbar
            title="Admin Dashboard"
            fullName={admin.fullName}
            button={
              <DropdownNew
                label="Add User"
                options={[
                  { label: "HR", value: "hr" },
                  { label: "Trainer", value: "trainer" },
                  { label: "Management Staff", value: "management" },
                ]}
                icon={<UserPlus size={20} />}
                onSelect={(role) => {
                  setUserRole(role);
                  setAddUserModal(true);
                  if (role === "trainer") {
                    fetchAllBatches();
                  }
                }}
              />
            }
          />
        }
        Sidebar={<Sidebar menuItems={menuItems} />}
      />

      {userRole !== "" && (
        <FormModal
          title={formTitle}
          show={adduserModal}
          onClose={() => setAddUserModal(false)}
          formWrapper={getFormComponent()}
        />
      )}
    </>
  );
};

export default AdminDashboard;
