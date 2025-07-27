import axios from 'axios';

const BASE_URL = 'https://localhost:7096/api';

// Helper to get Authorization headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Đăng nhập
const postSignin = async (email, password) => {
  return axios.post(`${BASE_URL}/Auth/login`, { email, password });
};

// Đăng ký phụ huynh
const postRegister = async (firstName, lastName, email, password, passwordConfirm, gender) => {
  return axios.post(`${BASE_URL}/Parent/register`, {
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

// Lấy tất cả học sinh (dùng chung cho mọi vai trò)
const getAllStudents = async () => {
  return axios.get(`${BASE_URL}/students`, { headers: getAuthHeaders() });
};

// Lấy học sinh theo parentId
const getStudentsByParentId = async (parentId) => {
  return axios.get(`${BASE_URL}/students/by-parent`, { params: { parentId }, headers: getAuthHeaders() });
};

// Lấy user hiện tại
const currentUsers = async () => {
  return axios.get(`${BASE_URL}/Auth/current-user`, {
    headers: getAuthHeaders()
  });
};

// Lấy health profile mới nhất theo studentCode
const getNewestHealthProfile = async (studentCode) => {
  return axios.get(`${BASE_URL}/health-profiles/student/${studentCode}/latest`, { headers: getAuthHeaders() });
};

// Update health profile theo studentCode
const updateHealthProfile = async (studentCode, updatedHealthProfile) => {
  return axios.put(
    `${BASE_URL}/health-profiles/student/${studentCode}`,
    updatedHealthProfile,
    { headers: getAuthHeaders() }
  );
};
const createHealthProfile = async (profileData) => {
  return axios.post(`${BASE_URL}/health-profiles`, profileData, { headers: getAuthHeaders() });
};

// Xác nhận tiêm chủng cho học sinh
const acceptVaccine = async (data) => {
  return axios.post(`${BASE_URL}/session-students/parent/accept-vaccine`, data, { headers: getAuthHeaders() });
};

// Lấy danh sách lịch tiêm sắp tới
const getUpcomingVaccines = async () => {
  return axios.get(`${BASE_URL}/parent/vaccinations/upcoming`, {
    headers: getAuthHeaders()
  });
};

// Lấy danh sách lịch tiêm chưa xác nhận
const getListOfVaccines = async () => {
  return axios.get(`${BASE_URL}/parent/vaccinations/pending-consent`, {
    headers: getAuthHeaders()
  });
};

// Lấy tất cả đơn giao thuốc của phụ huynh
const getAllParentMedicationDelivery = async (parentId) => {
  return axios.get(`${BASE_URL}/parents/medication-deliveries/by-parent/${parentId}`, { headers: getAuthHeaders() });
};

// Tạo mới đơn giao thuốc của phụ huynh
const createParentMedicationDelivery = async (data) => {
  return axios.post(`${BASE_URL}/parents/medication-deliveries`, data, {
    headers: getAuthHeaders()
  });
};

// Lấy danh sách loại vaccine
const getVaccineTypes = async () => {
  return axios.get(`${BASE_URL}/VaccineType?pageNumber=1&pageSize=20`, {
    headers: getAuthHeaders()
  });
};

// Tạo chiến dịch tiêm chủng
const createVaccinationCampaign = async (data) => {
  return axios.post(`${BASE_URL}/VaccinationCampaign`, data, {
    headers: getAuthHeaders()
  });
};

// Tạo lịch tiêm chủng
const createVaccinationSchedule = async (data) => {
  return axios.post(`${BASE_URL}/VaccinationSchedule`, data, {
    headers: getAuthHeaders()
  });
};

// Tạo chiến dịch khám sức khỏe
const createCheckupCampaign = async (data) => {
  return axios.post(`${BASE_URL}/CheckupCampaign`, data, { headers: getAuthHeaders() });
};

// Tạo lịch khám sức khỏe
const createCheckupSchedule = async (data) => {
  return axios.post(`${BASE_URL}/CheckupSchedule`, data, { headers: getAuthHeaders() });
};

// Lấy danh sách đơn thuốc giao của phụ huynh (tất cả trạng thái)
const getPendingMedicationDeliveries = async () => {
  return axios.get(`${BASE_URL}/parents/medication-deliveries`, {
    headers: getAuthHeaders()
  });
};

// Cập nhật trạng thái đơn thuốc
const updateMedicationDeliveryStatus = async (parentMedicationDeliveryId, status) => {
  return axios.post(
    `${BASE_URL}/parents/medication-deliveries/update-status?parentMedicationDeliveryId=${parentMedicationDeliveryId}&status=${status}`,
    {},
    { headers: getAuthHeaders() }
  );
};

// Lấy danh sách lịch khám sức khỏe
const getCheckupSchedules = async () => {
  return axios.get(`${BASE_URL}/CheckupSchedule`, {
    headers: getAuthHeaders()
  });
};

// Lấy lịch khám sức khỏe theo studentId
const getCheckupSchedulesByStudentId = async (studentId) => {
  return axios.get(`${BASE_URL}/CheckupSchedule/Student`, {
    params: { studentId },
    headers: getAuthHeaders()
  });
};

// Xác nhận consent lịch khám sức khỏe
const consentCheckupSchedule = async (scheduleId, consentStatus, notes) => {
  return axios.post(`${BASE_URL}/CheckupSchedule/consent`, {
    scheduleId,
    consentStatus,
    notes
  }, {
    headers: getAuthHeaders()
  });
};

// Lấy danh sách nurse profiles
const getNurseProfiles = async () => {
  return axios.get(`${BASE_URL}/NurseProfile/all`, {
    headers: getAuthHeaders()
  });
};

// Tạo checkup record
const createCheckupRecord = async (data) => {
  return axios.post(`${BASE_URL}/checkup-records`, data, {
    headers: getAuthHeaders()
  });
};

// Lấy danh sách lịch tư vấn theo staffId
const getCounselingAppointmentsByStaffId = async (staffId) => {
  return axios.get(`${BASE_URL}/counseling-appointments/staff/${staffId}`, {
    headers: getAuthHeaders()
  });
};

// Thêm ghi chú cho counseling appointment
const addCounselingAppointmentNote = async (data) => {
  return axios.post(`${BASE_URL}/counseling-appointments/add-note`, data, {
    headers: getAuthHeaders()
  });
};

// Lấy hồ sơ khám sức khỏe theo studentId
export const getCheckupRecordsByStudentId = async (studentId) => {
  return axios.get(`${BASE_URL}/checkup-records/by-id/${studentId}`, { headers: getAuthHeaders() });
};

// Lấy lịch tư vấn theo studentId
export const getCounselingAppointmentsByStudentId = async (studentId) => {
  return axios.get(`${BASE_URL}/counseling-appointments/id/${studentId}`, { headers: getAuthHeaders() });
};

// Lấy danh sách checkup records theo staffId (nurseId)
export const getCheckupRecordsByStaffId = async (staffId) => {
  return axios.get(`${BASE_URL}/checkup-records/staff/${staffId}`, {
    headers: getAuthHeaders()
  });
};

// Lấy lịch khám sức khỏe của tất cả con (my-children)
const getCheckupSchedulesMyChildren = async () => {
  return axios.get(`${BASE_URL}/CheckupSchedule/my-children`, {
    headers: getAuthHeaders()
  });
};

// Khai báo sự kiện y tế
export const createHealthEvent = async (data) => {
  return await axios.post(`${BASE_URL}/HealthEvent`, data, { headers: getAuthHeaders() });
};

// Lấy danh sách lịch tiêm chủng
export const getVaccinationSchedules = async () => {
  return axios.get(`${BASE_URL}/VaccinationSchedule`, { headers: getAuthHeaders() });
};

// Lấy chi tiết lịch tiêm chủng
export const getVaccinationScheduleDetail = async (id) => {
  return axios.get(`${BASE_URL}/VaccinationSchedule/${id}`, { headers: getAuthHeaders() });
};

// Tạo record tiêm chủng
export const createVaccinationRecord = async (data) => {
  return axios.post(`${BASE_URL}/VaccinationRecord`, data, { headers: getAuthHeaders() });
};

// Lấy danh sách lịch tiêm cần xác nhận
export const getPendingVaccinationConsents = () =>
  axios.get(`${BASE_URL}/parent/vaccinations/pending-consent`, { headers: getAuthHeaders() });

// Gửi xác nhận đồng ý/không đồng ý tiêm
export const acceptVaccinationConsent = (payload) =>
  axios.post(`${BASE_URL}/session-students/parent/accept-vaccine`, payload, { headers: getAuthHeaders() });

// Lấy tất cả lịch tiêm của con
export const getVaccinationSchedulesMyChildren = () =>
  axios.get(`${BASE_URL}/VaccinationSchedule/my-children`, { headers: getAuthHeaders() });

// Lấy danh sách lô vật tư y tế
const getMedicalSupplyLots = async () => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot`, { headers: getAuthHeaders() });
};

// Cập nhật điều trị cho sự kiện y tế
const updateHealthEventTreatment = async (data) => {
  // data: { healthEventId, supplyUsages: [{ medicalSupplyLotId, quantityUsed, notes }] }
  return axios.put(`${BASE_URL}/HealthEvent/treatment`, data, { headers: getAuthHeaders() });
};

// Lấy danh sách sự kiện y tế
const getHealthEvents = async () => {
  return axios.get(`${BASE_URL}/HealthEvent`, { headers: getAuthHeaders() });
};

// Lấy danh sách sự kiện y tế của con (dành cho phụ huynh)
const getHealthEventsMyChild = async () => {
  return axios.get(`${BASE_URL}/HealthEvent/myChild`, { headers: getAuthHeaders() });
};

export const declareVaccination = (payload) => {
  return axios.post(`${BASE_URL}/parent/vaccinations`, payload, {
    headers: getAuthHeaders()
  });
};

export const getVaccinationRecordsByStudentId = (studentId) => {
  return axios.get(`${BASE_URL}/VaccinationRecord/student/${studentId}`, { headers: getAuthHeaders() });
};

export const getAllVaccinationRecords = () => {
  return axios.get(`${BASE_URL}/VaccinationRecord/get-all-vaccination-records`, { headers: getAuthHeaders() });
};

// Update vaccination record
export const updateVaccinationRecord = async (id, data) => {
  console.log(`Sending update to: ${BASE_URL}/VaccinationRecord/${id}`);
  console.log("With data:", data);
  
  if (!id) {
    throw new Error("ID is required for updating vaccination record");
  }
  
  return axios.put(`${BASE_URL}/VaccinationRecord/${id}`, data, { headers: getAuthHeaders() });
};

// Get vaccination records by schedule ID
export const getVaccinationRecordsByScheduleId = async (scheduleId) => {
  return axios.get(`${BASE_URL}/VaccinationRecord/schedule/${scheduleId}`, { headers: getAuthHeaders() });
};

// Get list of nurses
export const getNurses = async () => {
  return axios.get(`${BASE_URL}/NurseProfile/all`, { headers: getAuthHeaders() });
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
  getListOfVaccines,
  getAllParentMedicationDelivery,
  createParentMedicationDelivery,
  getVaccineTypes,
  createVaccinationCampaign,
  createVaccinationSchedule,
  createCheckupCampaign,
  createCheckupSchedule,
  getPendingMedicationDeliveries,
  updateMedicationDeliveryStatus,
  getCheckupSchedules,
  getNurseProfiles,
  createCheckupRecord,
  getCounselingAppointmentsByStaffId,
  addCounselingAppointmentNote,
  getCheckupSchedulesByStudentId,
  consentCheckupSchedule,
  getCheckupSchedulesMyChildren,
  getMedicalSupplyLots,
  updateHealthEventTreatment,
  getHealthEvents,
  getHealthEventsMyChild,
};

