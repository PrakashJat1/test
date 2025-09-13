import Login from "@/components/auth/Login";
import NotFound from "@/components/auth/NotFound";
import Register from "@/components/auth/Register";
import ResetPassword from "@/components/auth/ResetPassword";
import Unauthorized from "@/components/auth/Unauthorized";
import VerifyOTP from "@/components/auth/VerifyOTP";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import HRMainDashboard from "@/components/dashboard/HRMainDashboard";
import ITEPApplicantDashboard from "@/components/dashboard/ITEPApplicantDashboard";
import { LabAssistantDashboard } from "@/components/dashboard/LabAssistantDashboard";
import ManagementMainDashboard from "@/components/dashboard/ManagementMainDashboard";
import StudentMainDashboard from "@/components/dashboard/StudentMainDashboard";
import TrainerMainDashboard from "@/components/dashboard/TrainerMainDashboard";
import AssessmentPage from "@/components/pages/admin/AssessmentPage";
import BatchPage from "@/components/pages/admin/BatchPage";
import BookPage from "@/components/pages/admin/BookPage";
import CompanyPage from "@/components/pages/admin/CompanyPage";
import DashboardPage from "@/components/pages/admin/DashboardPage";
import ITEPApplicant from "@/components/pages/admin/ITEPApplicant";
import PDFPage from "@/components/pages/admin/PDFPage";
import ProjectsPage from "@/components/pages/admin/ProjectsPage";
import SaturdaySessionPage from "@/components/pages/admin/SaturdaySessionPage";
import StudentPage from "@/components/pages/admin/StudentPage";
import TimetablePage from "@/components/pages/admin/TimetablePage";
import ToastmasterPage from "@/components/pages/admin/ToastmasterPage";
import TrainerPage from "@/components/pages/admin/TrainerPage";
import UserPage from "@/components/pages/admin/UserPage";
import { HomePage } from "@/components/pages/HomePage";
import HRCompanyPage from "@/components/pages/hr/HRCompanyPage";
import HRDashboardPage from "@/components/pages/hr/HRDashboardPage";
import HRStudentPage from "@/components/pages/hr/HRStudentPage";
import HRToastMasterPage from "@/components/pages/hr/HRToastMasterPage";
import ManagementAssessmentPage from "@/components/pages/management/ManagementAssessmentPage";
import ManagementBatchPage from "@/components/pages/management/ManagementBatchPage";
import ManagementBookPage from "@/components/pages/management/ManagementBookPage";
import ManagementCompanyPage from "@/components/pages/management/ManagementCompanyPage";
import ManagementDashboardPage from "@/components/pages/management/ManagementDashboardPage";
import ManagementITEPApplicantPage from "@/components/pages/management/ManagementITEPApplicantPage";
import ManagementPDFPage from "@/components/pages/management/ManagementPDFPage";
import ManagementProjectsPage from "@/components/pages/management/ManagementProjectsPage";
import ManagementSaturdayPage from "@/components/pages/management/ManagementSaturdayPage";
import ManagementStudentPage from "@/components/pages/management/ManagementStudentPage";
import ManagementTimetablePage from "@/components/pages/management/ManagementTimetablePage";
import ManagementToastmasterPage from "@/components/pages/management/ManagementToastmasterPage";
import ManagementTrainerPage from "@/components/pages/management/ManagementTrainerPage";
import StudentAssessmentsPage from "@/components/pages/student/StudentAssessmentsPage";
import StudentBooksPage from "@/components/pages/student/StudentBooksPage";
import StudentCompaniesPage from "@/components/pages/student/StudentCompaniesPage";
import StudentDashboardPage from "@/components/pages/student/StudentDashboardPage";
import StudentDocumentsPage from "@/components/pages/student/StudentDocumentsPage";
import StudentProjectsPage from "@/components/pages/student/StudentProjectsPage";
import StudentSaturdaySessionsPage from "@/components/pages/student/StudentSaturdaySessionsPage";
import StudentToastMastersPage from "@/components/pages/student/StudentToastMastersPage";
import TrainerAssessmentsPage from "@/components/pages/trainer/TrainerAssessmentsPage";
import TrainerDashboardPage from "@/components/pages/trainer/TrainerDashboardPage";
import TrainerPDFpage from "@/components/pages/trainer/TrainerPDFpage";
import TrainerProjectPage from "@/components/pages/trainer/TrainerProjectPage";
import AboutUs from "@/layouts/AboutUs";
import PrivateRoute from "@/routes/PrivateRoute";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />

      {/*Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="trainer" element={<TrainerPage />} />
        <Route path="student" element={<StudentPage />} />
        <Route path="itep-applicant" element={<ITEPApplicant />} />
        <Route path="batch" element={<BatchPage />} />
        <Route path="assessment" element={<AssessmentPage />} />
        <Route path="toastmaster" element={<ToastmasterPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="saturday-session" element={<SaturdaySessionPage />} />
        <Route path="project" element={<ProjectsPage />} />
        <Route path="pdf" element={<PDFPage />} />
      </Route>

      {/*Management Routes */}
      <Route
        path="/management"
        element={
          <PrivateRoute allowedRoles={["admin", "management"]}>
            <ManagementMainDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<ManagementDashboardPage />} />
        <Route path="dashboard" element={<ManagementDashboardPage />} />
        <Route
          path="itep-applicant"
          element={<ManagementITEPApplicantPage />}
        />
        <Route path="assessment" element={<ManagementAssessmentPage />} />
        <Route path="project" element={<ManagementProjectsPage />} />
        <Route path="saturday-session" element={<ManagementSaturdayPage />} />
        <Route path="book" element={<ManagementBookPage />} />
        <Route path="timetable" element={<ManagementTimetablePage />} />
        <Route path="trainer" element={<ManagementTrainerPage />} />
        <Route path="student" element={<ManagementStudentPage />} />
        <Route path="batch" element={<ManagementBatchPage />} />
        <Route path="company" element={<ManagementCompanyPage />} />
        <Route path="toastmaster" element={<ManagementToastmasterPage />} />
        <Route path="pdf" element={<ManagementPDFPage />} />
      </Route>

      {/**Technical Trainer Routes */}
      <Route
        path="/technical-trainer"
        element={
          <PrivateRoute allowedRoles={["admin", "technical"]}>
            <TrainerMainDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<TrainerDashboardPage />} />
        <Route path="dashboard" element={<TrainerDashboardPage />} />
        <Route path="assessment" element={<TrainerAssessmentsPage />} />
        <Route path="project" element={<TrainerProjectPage />} />
        <Route path="pdf" element={<TrainerPDFpage />} />
      </Route>

      {/**Softskill Trainer Routes */}
      <Route
        path="/softskill-trainer"
        element={
          <PrivateRoute allowedRoles={["admin", "softskill"]}>
            <TrainerMainDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<TrainerDashboardPage />} />
        <Route path="dashboard" element={<TrainerDashboardPage />} />
        <Route path="assessment" element={<TrainerAssessmentsPage />} />
        <Route path="pdf" element={<TrainerPDFpage />} />
      </Route>
      {/**Aptitude Trainer Routes */}
      <Route
        path="/aptitude-trainer"
        element={
          <PrivateRoute allowedRoles={["admin", "aptitude"]}>
            <TrainerMainDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<TrainerDashboardPage />} />
        <Route path="dashboard" element={<TrainerDashboardPage />} />
        <Route path="assessment" element={<TrainerAssessmentsPage />} />
        <Route path="pdf" element={<TrainerPDFpage />} />
      </Route>

      {/**Student Routes */}
      <Route
        path="/student"
        element={
          <PrivateRoute allowedRoles={["admin", "student"]}>
            <StudentMainDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<StudentDashboardPage />} />
        <Route path="dashboard" element={<TrainerDashboardPage />} />
        <Route path="assessments" element={<StudentAssessmentsPage />} />
        <Route path="projects" element={<StudentProjectsPage />} />
        <Route path="books" element={<StudentBooksPage />} />
        <Route
          path="saturday-sessions"
          element={<StudentSaturdaySessionsPage />}
        />
        <Route path="companies" element={<StudentCompaniesPage />} />
        <Route path="toast-master" element={<StudentToastMastersPage />} />
        <Route path="documents" element={<StudentDocumentsPage />} />
      </Route>

      {/**HR Trainer Routes */}
      <Route
        path="/hr"
        element={
          <PrivateRoute allowedRoles={["admin", "hr"]}>
            <HRMainDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<HRDashboardPage />} />
        <Route path="dashboard" element={<HRDashboardPage />} />
        <Route path="companies-drives" element={<HRCompanyPage />} />
        <Route path="toast-master" element={<HRToastMasterPage />} />
        <Route path="students" element={<HRStudentPage />} />
      </Route>

      {/**Lab Assistant Routes */}
      <Route
        path="/labassistant"
        element={
          <PrivateRoute allowedRoles={["labassistant"]}>
            <LabAssistantDashboard />
          </PrivateRoute>
        }
      />
      {/**ITEP Applicant Trainer Routes */}
      <Route
        path="/itep-applicant"
        element={
          <PrivateRoute allowedRoles={["itep-applicant"]}>
            <ITEPApplicantDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
