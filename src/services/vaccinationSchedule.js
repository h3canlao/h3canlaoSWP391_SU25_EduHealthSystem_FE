import axios from "axios";

// Hàm lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BASE_URL = "https://localhost:7096/api";

// Danh sách
export const getVaccinationSchedules = (params) =>
  axios.get(`${BASE_URL}/VaccinationSchedule`, {
    params,
    headers: getAuthHeaders(),
  });

// Lịch đã xóa
export const getDeletedVaccinationSchedules = (params) =>
  axios.get(`${BASE_URL}/VaccinationSchedule/deleted`, {
    params,
    headers: getAuthHeaders(),
  });

// Tạo mới
export const createVaccinationSchedule = (data) =>
  axios.post(`${BASE_URL}/VaccinationSchedule`, data, {
    headers: getAuthHeaders(),
  });

// Cập nhật (edit)
export const updateVaccinationSchedule = (id, data) =>
  axios.put(`${BASE_URL}/VaccinationSchedule/${id}`, data, {
    headers: getAuthHeaders(),
  });

// Xem chi tiết 1 lịch
export const getVaccinationScheduleById = (id) =>
  axios.get(`${BASE_URL}/VaccinationSchedule/${id}`, {
    headers: getAuthHeaders(),
  });

// Xóa nhiều (batch, dùng body là mảng ids)
export const deleteVaccinationSchedules = (ids, isPermanent = false) =>
  axios.delete(`${BASE_URL}/VaccinationSchedule/batch`, {
    data: ids, // đúng theo API
    headers: getAuthHeaders(),
  });

// Phục hồi nhiều
export const restoreVaccinationSchedules = (ids) =>
  axios.patch(`${BASE_URL}/VaccinationSchedule/batch/restore`, ids, {
    headers: getAuthHeaders(),
  });

// Đổi trạng thái nhiều
export const updateStatusVaccinationSchedules = (scheduleIds, newStatus, notes) =>
  axios.patch(
    `${BASE_URL}/VaccinationSchedule/batch/status`,
    {
      scheduleIds,
      newStatus,
      notes,
    },
    {
      headers: getAuthHeaders(),
    }
  );

// PATCH /api/VaccinationSchedule/{scheduleId}/start
export const startVaccinationSchedule = (scheduleId) =>
  axios.patch(`${BASE_URL}/VaccinationSchedule/${scheduleId}/start`, null, {
    headers: getAuthHeaders(),
  });

// PATCH /api/VaccinationSchedule/{scheduleId}/complete
export const completeVaccinationSchedule = (scheduleId) =>
  axios.patch(`${BASE_URL}/VaccinationSchedule/${scheduleId}/complete`, null, {
    headers: getAuthHeaders(),
  });
