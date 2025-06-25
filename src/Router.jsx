import Register from "@/pages/Parents/Auth/Register/Register";
import Signin from "@/pages/Parents/Auth/Signin/Signin";
import ForgetPassword from "@/pages/Parents/Auth/2FA/ForgetPassword/forgetPassword"
import ResetPassword from "@/pages/Parents/Auth/2FA/ResetPassword/resetPassword"
import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmEmail from "@/pages/Parents/Auth/2FA/ConfirmEmail/confirmEmail"

import HealthCheckup from "./pages/Parents/MedicalCheckups/HealthCheckup";
import SendMedication from "./pages/Parents/Medication/SendMedication";
import Notifications from "./pages/Parents/Notifications/Notifications";
import StudentProfiles from "./pages/Parents/StudentProfiles/StudentProfiles";
import Parents from "./pages/Parents/Parents";
import VaccineOverview from "./pages/Parents/Immunization/VaccineOverview";
import Admin from "./pages/Admin/Admin";
import ManageUser from "./pages/Admin/Features/ManageUser";
import MedicationAdmin from "./pages/Admin/Medication";
import VaccinationCampaignAdmin from "./pages/Admin/VaccinationCampaign/VaccinationCampaign";
import MedicalSupplyAdmin from "./pages/Admin/MedicalSupply/MedicalSupplyAdmin";
import MedicalSupplyLotAdmin from "./pages/Admin/MedicalSupply/MedicalSupplyLotAdmin";
import MedicationLotAdmin from "./pages/Admin/Medication/MedicationLotAdmin";
import VaccinationScheduleAdmin from "./pages/Admin/VaccinationSchedule/VaccinationSchedule";
import MedicationManager from "./pages/Admin/Medication/MedicationManager";
import MedicalSupplyManager from "./pages/Admin/MedicalSupply/MedicalSupplyManager";



const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/parents" element={<Parents />}>
          <Route path="vaccine-overview" element={<VaccineOverview />}/>
          <Route path="medical-checkups" element={<HealthCheckup />} />
          <Route path="send-medication" element={<SendMedication />} />
          <Route path="confirm-medications" element={<SendMedication />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="student-profiles" element={<StudentProfiles />} />
        </Route>
         <Route path="/admin" element={<Admin />}>
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-medication" element={<MedicationManager />} />
          <Route path="manage-medicalSupply" element={<MedicalSupplyManager />} />
          <Route path="manage-vaccinationCampaign" element={<VaccinationCampaignAdmin />} />
          <Route path="manage-vaccinationSchedule" element={<VaccinationScheduleAdmin />} />
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
