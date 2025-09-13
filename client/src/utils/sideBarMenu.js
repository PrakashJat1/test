import {
  Home,
  Users,
  BarChart3,
  BookOpen,
  FolderKanban,
  ClipboardList,
  ClipboardCheck,
  Boxes,
  UserCog,
  GraduationCap,
  FileSearch,
  Mic,
  Building2,
  CalendarClock,
  Projector,
  File,
  CalendarCheck,
  Briefcase,
  MicVocal,
  LucideBuilding2,
  Files,
} from "lucide-react";

export const getSidebarMenu = (role) => {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
        { label: "Users", icon: Users, path: "/admin/users" },
        {
          label: "ITEP Applicants",
          icon: FileSearch,
          path: "/admin/itep-applicant",
        },
        { label: "Trainers", icon: UserCog, path: "/admin/trainer" },
        { label: "Students", icon: GraduationCap, path: "/admin/student" },
        { label: "Batches", icon: Boxes, path: "/admin/batch" },
        {
          label: "Assessments",
          icon: ClipboardCheck,
          path: "/admin/assessment",
        },
        { label: "ToastMaster", icon: Mic, path: "/admin/toastmaster" },
        { label: "Books", icon: BookOpen, path: "/admin/book" },
        { label: "Companies", icon: Building2, path: "/admin/company" },
        { label: "Timetable", icon: CalendarClock, path: "/admin/timetable" },
        {
          label: "Saturday",
          icon: Mic,
          path: "/admin/saturday-session",
        },
        {
          label: "Projects",
          icon: Projector,
          path: "/admin/project",
        },
        { label: "PDF", icon: File, path: "/admin/pdf" },
      ];

    case "management":
      return [
        { label: "Dashboard", icon: BarChart3, path: "/management/dashboard" },
        {
          label: "ITEP Applicants",
          icon: FileSearch,
          path: "/management/itep-applicant",
        },
        {
          label: "Assessments",
          icon: ClipboardCheck,
          path: "/management/assessment",
        },
        {
          label: "Projects",
          icon: Projector,
          path: "/management/project",
        },
        {
          label: "Saturday",
          icon: Mic,
          path: "/management/saturday-session",
        },
        { label: "Books", icon: BookOpen, path: "/management/book" },
        {
          label: "Timetable",
          icon: CalendarClock,
          path: "/management/timetable",
        },
        { label: "Trainers", icon: UserCog, path: "/management/trainer" },
        { label: "Students", icon: GraduationCap, path: "/management/student" },
        { label: "Batches", icon: Boxes, path: "/management/batch" },
        { label: "Companies", icon: Building2, path: "/management/company" },
        { label: "ToastMaster", icon: Mic, path: "/management/toastmaster" },
        { label: "PDF", icon: File, path: "/management/pdf" },
      ];

    case "technical":
      return [
        {
          label: "Dashboard",
          icon: BarChart3,
          path: "/technical-trainer/dashboard",
        },
        {
          label: "Assessments",
          icon: ClipboardCheck,
          path: "/technical-trainer/assessment",
        },
        {
          label: "Projects",
          icon: Projector,
          path: "/technical-trainer/project",
        },
        { label: "PDF", icon: File, path: "/technical-trainer/pdf" },
      ];

    case "softskill":
      return [
        {
          label: "Dashboard",
          icon: BarChart3,
          path: "/softskill-trainer/dashboard",
        },
        {
          label: "Assessments",
          icon: ClipboardCheck,
          path: "/softskill-trainer/assessment",
        },
        { label: "PDF", icon: File, path: "/softskill-trainer/pdf" },
      ];

    case "aptitude":
      return [
        {
          label: "Dashboard",
          icon: BarChart3,
          path: "/aptitude-trainer/dashboard",
        },
        {
          label: "Assessments",
          icon: ClipboardCheck,
          path: "/aptitude-trainer/assessment",
        },
        { label: "PDF", icon: File, path: "/aptitude-trainer/pdf" },
      ];
    case "student":
      return [
        { label: "Dashboard", icon: Home, path: "/student" },
        {
          label: "Assessments",
          icon: ClipboardList,
          path: "/student/assessments",
        },
        { label: "Projects", icon: FolderKanban, path: "/student/projects" },
        { label: "Books", icon: BookOpen, path: "/student/books" },
        {
          label: "Saturday",
          icon: CalendarCheck,
          path: "/student/saturday-sessions",
        },
        { label: "Companies", icon: Briefcase, path: "/student/companies" },
        {
          label: "Toast-Master",
          icon: MicVocal,
          path: "/student/toast-master",
        },
        {
          label: "Documents",
          icon: Files,
          path: "/student/documents",
        },
      ];
    case "hr":
      return [
        { label: "Dashboard", icon: Home, path: "/hr/dashboard" },
        {
          label: "Company Drives",
          icon: LucideBuilding2,
          path: "/hr/companies-drives",
        },
        { label: "Toast-Master", icon: MicVocal, path: "/hr/toast-master" },
        { label: "Students", icon: Users, path: "/hr/students" },
      ];
    case "manager":
      return [];
    default:
      return [{ label: "Dashboard", icon: Home, path: "/" }];
  }
};
