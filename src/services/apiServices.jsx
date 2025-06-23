import axios from 'axios';

const BASE_URL = 'https://localhost:7096/api';

// Đăng nhập
const postSignin = async (email, password) => {
  return axios.post(`${BASE_URL}/Auth/login`, { email, password });
};

// Đăng ký phụ huynh
const postRegister = async (firstName, lastName, email, password, passwordConfirm, gender) => {
  return axios.post(`${BASE_URL}/Parent/register-parent`, {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    gender,
  });
};

// Quên mật khẩu
const forgetPassword = async (email) => {
  return axios.post(`${BASE_URL}/Auth/forgot-password`, { email });
};

// Đặt lại mật khẩu
const resetPassword = async ({ email, token, newPassword }) => {
  return axios.post(`${BASE_URL}/Auth/reset-password`, { email, token, newPassword });
};

// Xác minh email
const verifyEmail = async (userId, token) => {
  return axios.get(`${BASE_URL}/Auth/confirm-email`, { params: { userId, token } });
};

// Lấy tất cả học sinh
const getAllStudents = async () => {
  return axios.get(`${BASE_URL}/Student/get-all-students`);
};

// Lấy học sinh theo parentId
const getStudentsByParentId = async (parentId) => {
  return axios.get(`${BASE_URL}/Student/get-students-by-parent-id`, { params: { parentId } });
};

// Lấy user hiện tại
const currentUsers = async (token) => {
  return axios.get(`${BASE_URL}/Auth/current-user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Lấy health profile mới nhất theo studentCode
const getNewestHealthProfile = async (studentCode) => {
  return axios.get(`${BASE_URL}/HealthProfile/get-newest-healprofile-by-student-code/${studentCode}`);
};

// Update health profile theo studentCode
const updateHealthProfile = async (studentCode, updatedHealthProfile) => {
  return axios.post(
    `${BASE_URL}/HealthProfile/update-healprofile-by-studentcode/${studentCode}`,
    updatedHealthProfile
  );
};
const createHealthProfile = async (profileData) => {
  return axios.post(`${BASE_URL}/HealthProfile/create`, profileData);
};

// Xác nhận tiêm chủng cho học sinh
const acceptVaccine = async (data) => {
  return axios.post(`${BASE_URL}/SessionStudent/Parent-Acpt-Vaccine`, data);
};

// Lấy danh sách lịch tiêm sắp tới
const getUpcomingVaccines = async (token) => {
  return axios.get(`${BASE_URL}/parent/vaccinations/upcoming`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Lấy danh sách lịch tiêm chưa xác nhận
const getListOfVaccines = async (token) => {
  return axios.get(`${BASE_URL}/parent/vaccinations/pending-consent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export {
  postSignin,
  postRegister,
  forgetPassword,
  resetPassword,
  verifyEmail,
  getAllStudents,
  getStudentsByParentId,
  currentUsers,
  updateHealthProfile,
  getNewestHealthProfile,
  createHealthProfile,
  acceptVaccine,
  getUpcomingVaccines,
  getListOfVaccines
};
