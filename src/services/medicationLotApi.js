import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

// Danh sách lô (phân trang, lọc, search)
export const getMedicationLots = async (params) => {
  return axios.get(`${BASE_URL}/MedicationLot`, { params });
};

// Thêm mới
export const createMedicationLot = async (data) => {
  return axios.post(`${BASE_URL}/MedicationLot`, data);
};

// Sửa lô
export const updateMedicationLot = async (id, data) => {
  return axios.put(`${BASE_URL}/MedicationLot/${id}`, data);
};

// Xóa batch (mềm/vĩnh viễn)
export const deleteMedicationLotsBatch = async (ids, isPermanent = false) => {
  return axios.post(`${BASE_URL}/MedicationLot/batch/delete`, { ids, isPermanent });
};

// Khôi phục batch
export const restoreMedicationLotsBatch = async (ids) => {
  return axios.post(`${BASE_URL}/MedicationLot/batch/restore`, { ids });
};

// Lô đã xóa
export const getDeletedMedicationLots = async (params = {}) => {
  return axios.get(`${BASE_URL}/MedicationLot/deleted`, { params });
};

// Lô sắp hết hạn
export const getExpiringMedicationLots = async () => {
  return axios.get(`${BASE_URL}/MedicationLot/expiring`);
};

// Lô đã hết hạn
export const getExpiredMedicationLots = async () => {
  return axios.get(`${BASE_URL}/MedicationLot/expired`);
};

// Sửa nhanh số lượng
export const updateMedicationLotQuantity = async (id, quantity) => {
  return axios.patch(`${BASE_URL}/MedicationLot/${id}/quantity`, { quantity });
};
