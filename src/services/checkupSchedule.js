import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

// Danh sách
export const getCheckupSchedules = (params) => axios.get(`${BASE_URL}/CheckupSchedule`, { params });

// Lịch đã xóa
export const getDeletedCheckupSchedules = (params) => axios.get(`${BASE_URL}/CheckupSchedule/deleted`, { params });

// Tạo mới
export const createCheckupSchedule = (data) => axios.post(`${BASE_URL}/CheckupSchedule`, data);

// Cập nhật (edit)
export const updateCheckupSchedule = (id, data) => axios.put(`${BASE_URL}/CheckupSchedule/${id}`, data);

// Xem chi tiết 1 lịch
export const getCheckupScheduleById = (id) => axios.get(`${BASE_URL}/CheckupSchedule/${id}/detail`); // Lưu ý: API có endpoint riêng cho detail

// Xóa nhiều (batch, dùng body là mảng ids)
export const deleteCheckupSchedules = (ids) => axios.post(`${BASE_URL}/CheckupSchedule/batch/delete`, ids); // Lưu ý: API dùng POST cho batch delete

// Phục hồi nhiều
export const restoreCheckupSchedules = (ids) => axios.post(`${BASE_URL}/CheckupSchedule/batch/restore`, ids); // Lưu ý: API dùng POST cho batch restore

// Đổi trạng thái nhiều
export const updateStatusCheckupSchedules = (scheduleIds, newStatus, notes) =>
  axios.post(`${BASE_URL}/CheckupSchedule/batch/update-status`, { scheduleIds, newStatus, notes });

// Lấy danh sách học sinh theo lịch (nếu cần)
// export const getStudentsInCheckupSchedule = (scheduleId) => axios.get(`${BASE_URL}/CheckupSchedule/${scheduleId}/students`);
