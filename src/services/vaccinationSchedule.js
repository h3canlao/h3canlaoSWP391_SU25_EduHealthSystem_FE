import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

// Danh sách
export const getVaccinationSchedules = (params) => axios.get(`${BASE_URL}/VaccinationSchedule`, { params });

// Lịch đã xóa
export const getDeletedVaccinationSchedules = (params) =>
  axios.get(`${BASE_URL}/VaccinationSchedule/deleted`, { params });

// Tạo mới
export const createVaccinationSchedule = (data) => axios.post(`${BASE_URL}/VaccinationSchedule`, data);

// Cập nhật (edit)
export const updateVaccinationSchedule = (id, data) => axios.put(`${BASE_URL}/VaccinationSchedule/${id}`, data);

// Xem chi tiết 1 lịch
export const getVaccinationScheduleById = (id) => axios.get(`${BASE_URL}/VaccinationSchedule/${id}`);

// Xóa nhiều (batch, dùng body là mảng ids)
export const deleteVaccinationSchedules = (ids, isPermanent = false) =>
  axios.delete(`${BASE_URL}/VaccinationSchedule/batch`, {
    data: { ids, isPermanent }, // đúng theo API
  });

// Phục hồi nhiều
export const restoreVaccinationSchedules = (ids) =>
  axios.patch(`${BASE_URL}/VaccinationSchedule/batch/restore`, { ids });

// Đổi trạng thái nhiều
export const updateStatusVaccinationSchedules = (scheduleIds, newStatus, notes) =>
  axios.patch(`${BASE_URL}/VaccinationSchedule/batch/status`, { scheduleIds, newStatus, notes });
