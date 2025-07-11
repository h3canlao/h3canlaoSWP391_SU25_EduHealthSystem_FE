import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

// Danh sách lô, filter, paging, search, supply, expired
export const getMedicalSupplyLots = async (params) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot`, { params });
};

// Tạo mới
export const createMedicalSupplyLot = async (data) => {
  return axios.post(`${BASE_URL}/MedicalSupplyLot`, data);
};

// Cập nhật
export const updateMedicalSupplyLot = async (id, data) => {
  return axios.put(`${BASE_URL}/MedicalSupplyLot/${id}`, data);
};

// Xóa nhiều/xóa mềm/vĩnh viễn
export const deleteMedicalSupplyLots = async (ids, isPermanent = false) => {
  return axios.delete(`${BASE_URL}/MedicalSupplyLot`, { data: { ids, isPermanent } });
};

// Khôi phục nhiều
export const restoreMedicalSupplyLots = async (ids) => {
  return axios.post(`${BASE_URL}/MedicalSupplyLot/restore`, { ids });
};

// Lô đã xóa
export const getDeletedMedicalSupplyLots = async (params) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot`, { params: { ...params, includeDeleted: true } });
};

export const getExpiringLots = async () => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/expiring`);
};
export const getExpiredLots = async () => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/expired`);
};

export const getDeletedLots = async (params = {}) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/deleted`, { params });
};

// By supplyId
export const getLotsBySupplyId = async (medicalSupplyId) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/by-supply/${medicalSupplyId}`);
};

// Get lot detail
export const getMedicalSupplyLotById = async (id) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/${id}`);
};

// Update quantity
export const updateLotQuantity = async (id, quantity) => {
  return axios.patch(`${BASE_URL}/MedicalSupplyLot/${id}/quantity`, { quantity });
};
