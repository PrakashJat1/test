import CheckboxGroupField from "@/components/common/Form/CheckboxGroupField";
import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import SelectField from "@/components/common/Form/SelectField";
import Button from "@/components/common/UI/Button";
import DropdownNew from "@/components/common/UI/DropdownNew";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import DashboardLayout from "@/layouts/DashboardLayout";
import Navbar from "@/layouts/Navbar";
import Sidebar from "@/layouts/Sidebar";
import batchService from "@/services/batchService";
import companyService from "@/services/companyService";
import toastmasterService from "@/services/toastmasterService";
import { getSidebarMenu } from "@/utils/sideBarMenu";
import yupSchemas from "@/utils/yupSchemas";
import { PlusCircle, PlusSquareIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const HRMainDashboard = () => {
  const user = useAuth().user;
  const menuItems = getSidebarMenu(user.role);

  const hr = useUser();

  const [allBatches, setAllBatches] = useState([]);
  const [selectedBatchStudentsForTMS, setSelectedBatchStudentsForTMS] =
    useState([]);

  const [addModal, setAddModal] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [selectedBatchForTMS, setSelectedBatchForTMS] = useState(null);

  const fetchAllBatches = async () => {
    try {
      const response = await batchService.getAll();
      setAllBatches(response.data);
    } catch (error) {
      toast.error("Error in fetching fetchAllBatches");
      console.log("Error in fetching fetchAllBatches", error);
    }
  };

  const setStudentsForTMS = (batchId) => {
    const students = allBatches
      .filter((b) => b._id === batchId)[0]
      .students.map((student) => ({
        label: student.userId.fullName,
        value: student._id,
      }));

    console.log(students);
    setSelectedBatchStudentsForTMS(students);
  };

  useEffect(() => {
    fetchAllBatches();
  }, []);

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

      await companyService.addCompany(payLoad);
      toast.success(`${data.name} Added Successfully`);
    } catch (error) {
      console.log("Erorr in handleAddCompany", error);
      toast.error("Error in handleAddCompany");
    } finally {
      setAddModal(false);
    }
  };

  const handleAddToastMaster = async (data) => {
    try {
      const roles = [
        { student: data.tmod, role: "Toastmaster of the Day", feedback: "" },
        { student: data.grammarian, role: "Grammarian", feedback: "" },
        { student: data.ps1, role: "Prepared Speech 1", feedback: "" },
        { student: data.ps2, role: "Prepared Speech 2", feedback: "" },
        {
          student: data.generalEvaluator,
          role: "General Evaluator",
          feedback: "",
        },
        { student: data.e1, role: "Evaluator 1", feedback: "" },
        { student: data.e2, role: "Evaluator 2", feedback: "" },
        { student: data.ttm, role: "Table Topic Master", feedback: "" },
        { student: data.is1, role: "Impromptu Speaker 1", feedback: "" },
        { student: data.is2, role: "Impromptu Speaker 2", feedback: "" },
        { student: data.is3, role: "Impromptu Speaker 3", feedback: "" },
        { student: data.ac, role: "Ah-Counter", feedback: "" },
        { student: data.timer, role: "Timer", feedback: "" },
      ];

      for (let i = 0; i < roles.length; i++) {
        let student = roles[i].student;
        for (let j = i + 1; j < roles.length; j++) {
          if (roles[j].student === student) {
            return toast.warn("Only One Student per role allowed..!");
          }
        }
      }

      const payLoad = {
        hostedBy: user?.userId,
        batch: selectedBatchForTMS,
        date: data.date,
        theme: data.theme,
        wordOfDay: data.wordOfDay,
        idiom: data.idiom,
        roles,
      };
      await toastmasterService.createToastmaster(payLoad);
      toast.success(`Toast-Master Added Successfully`);
    } catch (error) {
      console.log("Erorr in handleAddToastMaster", error);
      toast.error("Error in handleAddToastMaster");
    } finally {
      setAddModal(false);
      setSelectedBatchForTMS(false);
      setFormValue("");
      setSelectedBatchStudentsForTMS([]);
    }
  };

  const AddCompanyForm = () => (
    <FormWrapper
      defaultValues={{
        name: "",
        roleOffered: "",
        packageOffered: "",
        driveDate: "",
        websiteLink: "",
        roundsInfo: "",
        batchIds: "",
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
          onClick={() => setAddModal(false)}
        >
          Cancel
        </button>
      </div>
    </FormWrapper>
  );

  const SelectBatchForTMSForm = () => (
    <FormWrapper
      defaultValues={{
        batch: "",
      }}
      schema={yupSchemas.selectBatchFormTMSSchema}
      onSubmit={(data) => setSelectedBatchForTMS(data.batch)}
    >
      <SelectField
        name="batch"
        label="Select Batch"
        options={allBatches.map((b) => ({
          label: b.batch_Name,
          value: b._id,
        }))}
        onChange={(value) => {
          setStudentsForTMS(value),
            setFormValue("toast-master2"),
            setSelectedBatchForTMS(value);
        }}
      />
    </FormWrapper>
  );

  const AddToastMasterForm = () => (
    <FormWrapper
      defaultValues={{
        theme: "",
        wordOfDay: "",
        idiom: "",
        date: "",
        tmod: "",
        grammarian: "",
        ps1: "",
        ps2: "",
        generalEvaluator: "",
        e1: "",
        e2: "",
        ttm: "",
        is1: "",
        is2: "",
        is3: "",
        ac: "",
        timer: "",
      }}
      schema={yupSchemas.createToastMasterSchema}
      onSubmit={handleAddToastMaster}
    >
      <InputField
        type="text"
        name="theme"
        label="Theme*"
        placeholder="Please enter theme of the day"
      />
      <InputField
        type="text"
        name="wordOfDay"
        label="Word*"
        placeholder="Please enter word of the day"
      />

      <InputField
        type="text"
        name="idiom"
        label="Idiom*"
        placeholder="Enter idiom of the day"
      />

      <InputField type="date" name="date" label="Date*" />

      <SelectField
        name="tmod"
        label="Toastmaster of the Day"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="grammarian"
        label="Grammarian"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ps1"
        label="Prepared Speech 1"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ps2"
        label="Prepared Speech 2"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="generalEvaluator"
        label="General Evaluator"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="e1"
        label="Evaluator 1"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="e2"
        label="Evaluator 2"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ttm"
        label="Table Topic Master"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="is1"
        label="Impromptu Speaker 1"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="is2"
        label="Impromptu Speaker 2"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="is3"
        label="Impromptu Speaker 3"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="ac"
        label="Ah-Counter"
        options={selectedBatchStudentsForTMS}
      />

      <SelectField
        name="timer"
        label="Timer"
        options={selectedBatchStudentsForTMS}
      />

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
    switch (formValue) {
      case "company":
        return <AddCompanyForm />;

      case "toast-master":
        return <SelectBatchForTMSForm />;

      case "toast-master2":
        return <AddToastMasterForm />;
      default:
        return null;
    }
  };

  return (
    <>
      {hr && (
        <DashboardLayout
          Navbar={
            <Navbar
              title={`${user.role} Dashboard`.toUpperCase()}
              fullName={hr?.fullName}
              button={
                <DropdownNew
                  label=" New "
                  options={[
                    { label: "Company", value: "company" },
                    { label: "Toast-Master", value: "toast-master" },
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

      {/* Add Company Modal */}
      <FormModal
        title={`Add ${formValue}`}
        show={addModal}
        onClose={() => setAddModal(false)}
        formWrapper={getFormComponent()}
      />
    </>
  );
};

export default HRMainDashboard;
