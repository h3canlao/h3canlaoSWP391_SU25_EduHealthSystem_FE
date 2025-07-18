import Register from "@/pages/Parents/Auth/Register/Register";
import Signin from "@/pages/Parents/Auth/Signin/Signin";
import ForgetPassword from "@/pages/Parents/Auth/2FA/ForgetPassword/forgetPassword";
import ResetPassword from "@/pages/Parents/Auth/2FA/ResetPassword/resetPassword";
import { Route, Routes, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmEmail from "@/pages/Parents/Auth/2FA/ConfirmEmail/confirmEmail";

import SendMedication from "./pages/Parents/Medication/SendMedication";
import Notifications from "./pages/Parents/Notifications/Notifications";
import StudentProfiles from "./pages/Parents/StudentProfiles/StudentProfiles";
import Parents from "./pages/Parents/Parents";
import ParentCheckupSchedules from "./pages/Parents/MedicalCheckups/ParentCheckupSchedules";
import ParentCheckupRecords from "./pages/Parents/MedicalCheckups/ParentCheckupRecords";
import Admin from "./pages/Admin/Admin";
import ManageUser from "./pages/Admin/Features/ManageUser";

import ParentCounselingRecords from "./pages/Parents/MedicalCheckups/ParentCounselingRecords";
import MedicationManager from "./pages/Admin/Medication/MedicationManager";
import VaccinationCampaignAdmin from "./pages/Admin/VaccinationCampaign/VaccinationCampaign";
import VaccinationScheduleAdmin from "./pages/Admin/VaccinationSchedule/VaccinationSchedule";
import MedicalSupplyManager from "./pages/Admin/MedicalSupply/MedicalSupplyManager";
import VaccineManager from "./pages/Admin/Vaccine/VaccineManager";

// SchoolNurse imports
import SchoolNurse from "./pages/SchoolNurse/SchoolNurse";
import PendingMedications from "./pages/SchoolNurse/PendingMedications/PendingMedications";
import HealthCheckups from "./pages/SchoolNurse/HealthCheckups/HealthCheckups";
import CounselingAppointments from "./pages/SchoolNurse/HealthCheckups/CounselingAppointments";
import Dashboard from "./pages/SchoolNurse/Dashboard";

import MedicalSupplyDetail from "./pages/Admin/MedicalSupply/MedicalSupplyAdminDetail";
import MedicationDetail from "./pages/Admin/Medication/MedicationDetail";
import VaccinationCampaignDetail from "./pages/Admin/VaccinationCampaign/VaccinationCampaignDetail";
import VaccinationScheduleDetail from "./pages/Admin/VaccinationSchedule/VaccinationScheduleDetail";
import VaccineTypeDetail from "./pages/Admin/Vaccine/VaccineTypeDetail";

import HealthEventForm from "./pages/SchoolNurse/HealthEvent/HealthEventForm";
import VaccinationSchedules from "./pages/SchoolNurse/Vaccination/VaccinationSchedules";
import VaccinationScheduleInfo from "./pages/SchoolNurse/Vaccination/VaccinationScheduleInfo";

import ParentVaccinationConsent from "./pages/Parents/Immunization/ParentVaccinationConsent";
import ParentVaccinationSchedules from "./pages/Parents/Immunization/ParentVaccinationSchedules";
import HealthEventTabs from "./pages/SchoolNurse/HealthEvent/HealthEventTabs";
import ParentHealthEvents from "./pages/Parents/ParentHealthEvents";
import ParentVaccinationRecords from "./pages/Parents/Immunization/ParentVaccinationRecords";

import { getUserRole } from "@/services/handleStorageApi";

// ProtectedRoute component
function ProtectedRoute({ children, allowedRoles }) {
  const role = getUserRole();
  if (!role) return <Navigate to="/signin" replace />;
  if (Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(role)) return <Navigate to="/signin" replace />;
  } else if (allowedRoles && role !== allowedRoles) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

import CheckupCampaignAdmin from "./pages/Admin/CheckupCampaign/CheckupCampaignAdmin";
import CheckupCampaignDetail from "./pages/Admin/CheckupCampaign/CheckupCampaignDetail";

import VaccinationRecords from "./pages/SchoolNurse/Vaccination/VaccinationRecords";
import CheckupScheduleAdmin from "./pages/Admin/CheckupSchedule/CheckupScheduleAdmin";
import GeneralDashboard from "./pages/Admin/GeneralDashboard";
import UserManagement from "./pages/Admin/Features/ManageUser";
import CheckupScheduleDetail from "./pages/Admin/CheckupSchedule/CheckupScheduleDetail";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />

        {/* Parents Routes */}
        <Route
          path="/parents"
          element={
            <ProtectedRoute allowedRoles={["Parent"]}>
              <Parents />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentProfiles />} />
          <Route path="checkup-schedules" element={<ParentCheckupSchedules />} />
          <Route path="checkup-records" element={<ParentCheckupRecords />} />
          <Route path="send-medication" element={<SendMedication />} />
          <Route path="confirmok-medications" element={<SendMedication />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="student-profiles" element={<StudentProfiles />} />
          <Route path="counseling-records" element={<ParentCounselingRecords />} />
          <Route path="vaccine-consent" element={<ParentVaccinationConsent />} />
          <Route path="vaccination-schedules" element={<ParentVaccinationSchedules />} />
          <Route path="vaccination-records" element={<ParentVaccinationRecords />} />
          <Route path="health-events" element={<ParentHealthEvents />} />
        </Route>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<GeneralDashboard />} />
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-medication" element={<MedicationManager />} />
          <Route path="manage-medication/:id" element={<MedicationDetail />} />
          <Route path="manage-medicalSupply" element={<MedicalSupplyManager />} />
          <Route path="manage-medicalSupply/:id" element={<MedicalSupplyDetail />} />
          <Route path="manage-vaccinationCampaign" element={<VaccinationCampaignAdmin />} />
          <Route path="manage-vaccinationCampaign/:id" element={<VaccinationCampaignDetail />} />
          <Route path="manage-vaccinationSchedule" element={<VaccinationScheduleAdmin />} />
          <Route path="manage-vaccinationSchedule/:id" element={<VaccinationScheduleDetail />} />
          <Route path="manage-vaccine" element={<VaccineManager />} />
          <Route path="manage-vaccineType/:id" element={<VaccineTypeDetail />} />
          <Route path="manage-checkupCampaign" element={<CheckupCampaignAdmin />} />
          <Route path="manage-checkupCampaign/:id" element={<CheckupCampaignDetail />} />
          <Route path="manage-checkupSchedule" element={<CheckupScheduleAdmin />} />
          <Route path="manage-checkupSchedule/:id" element={<CheckupScheduleDetail />} />
          <Route path="staff" element={<UserManagement />} />
        </Route>
        {/* SchoolNurse Routes */}
        <Route
          path="/nurse"
          element={
            <ProtectedRoute allowedRoles={["SchoolNurse"]}>
              <SchoolNurse />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pending-medications" element={<PendingMedications />} />
          <Route path="pending-medications" element={<PendingMedications />} />
          <Route path="health-checkups" element={<HealthCheckups />} />
          <Route path="counseling-appointments" element={<CounselingAppointments />} />
          <Route path="vaccination-schedules" element={<VaccinationSchedules />} />
          <Route path="vaccination-schedules/:id" element={<VaccinationScheduleInfo />} />
          <Route path="vaccination-records" element={<VaccinationRecords />} />
          <Route path="health-event" element={<HealthEventTabs />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default Router;
