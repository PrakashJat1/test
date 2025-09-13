import FormWrapper from "@/components/common/Form/FormWrapper";
import InputField from "@/components/common/Form/InputField";
import Button from "@/components/common/UI/Button";
import FormModal from "@/components/modals/FormModal";
import useAuth from "@/hooks/useAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import Navbar from "@/layouts/Navbar";
import Sidebar from "@/layouts/Sidebar";
import projectService from "@/services/projectService";
import studentService from "@/services/studentService";
import { getSidebarMenu } from "@/utils/sideBarMenu";
import yupSchemas from "@/utils/yupSchemas";
import { PlusSquareIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudentMainDashboard = () => {
  const user = useAuth().user;
  const menuItems = getSidebarMenu(user.role);

  const [student, setStudent] = useState(null);
  const [addModal, setAddModal] = useState(false);

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudentByUserId(user.userId);
      setStudent(response.data);
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Student is not found");
      } else toast.error("Error in fetchStudent");

      console.log("Error in  fetchStudent", error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const handleAddProject = async (data) => {
    try {
      const payLoad = {
        studentId: student._id,
        title: data.title,
        githubLink: data.githubLink.trim(),
      };
      await projectService.addProject(payLoad);
      toast.success("Project Added");
    } catch (error) {
      if (error.response.status === 409) toast.warning(error.response.data);
      else toast.error("Error in handleAddProject");
      console.log("Error in handleAddProject", error);
    } finally {
      setAddModal(false);
    }
  };

  const AddProjectForm = () => (
    <FormWrapper
      defaultValues={{ title: "", githubLink: "" }}
      schema={yupSchemas.addProjectSchema}
      onSubmit={handleAddProject}
    >
      <InputField
        name="title"
        label="Title"
        type="text"
        placeholder="Enter title"
      />

      <InputField
        name="githubLink"
        label="Github Link"
        type="text"
        placeholder="Enter Github Link"
      />

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

  return (
    <>
      {student && (
        <DashboardLayout
          Navbar={
            <Navbar
              title={`${user.role} Dashboard`.toUpperCase()}
              fullName={student?.userId?.fullName}
              button={
                <Button
                  label="Add Project"
                  icon={<PlusSquareIcon size={20} />}
                  onClick={() => setAddModal(true)}
                />
              }
            />
          }
          Sidebar={<Sidebar menuItems={menuItems} />}
        />
      )}

      <FormModal
        title={"Add Project"}
        show={addModal}
        onClose={() => setAddModal(false)}
        formWrapper={<AddProjectForm />}
      />
    </>
  );
};

export default StudentMainDashboard;
