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
import VaccineOverview from "./pages/Parents/Immunization/VaccineOverview";
import VaccineHistory from "./pages/Parents/Immunization/VaccineHistory";
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
import CreateVaccineSchedule from "./pages/SchoolNurse/CreateVaccineSchedule/CreateVaccineSchedule";
import CreateCheckupSchedule from "./pages/SchoolNurse/CreateCheckupSchedule/CreateCheckupSchedule";
import PendingMedications from "./pages/SchoolNurse/PendingMedications/PendingMedications";
import HealthCheckups from "./pages/SchoolNurse/HealthCheckups/HealthCheckups";
import CounselingAppointments from "./pages/SchoolNurse/HealthCheckups/CounselingAppointments";
import Dashboard from "./pages/SchoolNurse/Dashboard";
import MedicalSupplyDetail from "./pages/Admin/MedicalSupply/MedicalSupplyAdminDetail";
import MedicationDetail from "./pages/Admin/Medication/MedicationDetail";

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
        <Route path="/parents" element={<Parents />}>
          <Route path="vaccine-overview" element={<VaccineOverview />} />
          <Route path="vaccine-history" element={<VaccineHistory />} />
          <Route path="checkup-schedules" element={<ParentCheckupSchedules />} />
          <Route path="checkup-records" element={<ParentCheckupRecords />} />
          <Route path="send-medication" element={<SendMedication />} />
          <Route path="confirm-medications" element={<SendMedication />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="student-profiles" element={<StudentProfiles />} />
          <Route path="counseling-records" element={<ParentCounselingRecords />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />}>
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-medication" element={<MedicationManager />} />
          <Route path="manage-medication/:id" element={<MedicationDetail />} />
          <Route path="manage-medicalSupply" element={<MedicalSupplyManager />} />
          <Route path="manage-medicalSupply/:id" element={<MedicalSupplyDetail />} />
          <Route path="manage-vaccinationCampaign" element={<VaccinationCampaignAdmin />} />
          <Route path="manage-vaccinationSchedule" element={<VaccinationScheduleAdmin />} />
          <Route path="manage-vaccine" element={<VaccineManager />} />
        </Route>
        {/* SchoolNurse Routes */}
        <Route path="/nurse" element={<SchoolNurse />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-vaccine-schedule" element={<CreateVaccineSchedule />} />
          <Route path="create-checkup-schedule" element={<CreateCheckupSchedule />} />
          <Route path="pending-medications" element={<PendingMedications />} />
          <Route path="health-checkups" element={<HealthCheckups />} />
          <Route path="counseling-appointments" element={<CounselingAppointments />} />
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
