import Register from "@/pages/Parents/Auth/Register/Register";
import Signin from "@/pages/Parents/Auth/Signin/Signin";
import ForgetPassword from "@/pages/Parents/Auth/2FA/ForgetPassword/forgetPassword"
import ResetPassword from "@/pages/Parents/Auth/2FA/ResetPassword/resetPassword"
import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmEmail from "@/pages/Parents/Auth/2FA/ConfirmEmail/confirmEmail"


const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />       
        <Route path= "/confirm-email" element={<ConfirmEmail/>} />
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
