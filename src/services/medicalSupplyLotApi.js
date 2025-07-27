import axios from "axios";
const BASE_URL = "https://localhost:7096/api";
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// Lấy tất cả lô (có param filter, paging, search, expired, includeDeleted)
export const getMedicalSupplyLots = (params) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot`, { params });
};

// Tạo mới
export const createMedicalSupplyLot = (data) => {
  return axios.post(`${BASE_URL}/MedicalSupplyLot`, data);
};

// Cập nhật
export const updateMedicalSupplyLot = (id, data) => {
  return axios.put(`${BASE_URL}/MedicalSupplyLot/${id}`, data);
};

// Xóa nhiều
export const deleteMedicalSupplyLots = (ids, isPermanent = false) => {
  return axios.delete(`${BASE_URL}/MedicalSupplyLot`, { data: { ids, isPermanent } });
};

// Khôi phục nhiều
export const restoreMedicalSupplyLots = (ids) => {
  return axios.post(`${BASE_URL}/MedicalSupplyLot/restore`, { ids }, { headers: getAuthHeaders() });
};

// Lấy các lô sắp hết hạn hoặc hết hạn
// status: "expiring" (sắp hết hạn) hoặc "expired" (đã hết hạn)
// daysBeforeExpiry chỉ dùng khi status="expiring" (ví dụ 30 ngày trước hạn)
export const getLotsByExpiryStatus = (status = "expiring", daysBeforeExpiry = 30) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/expiry-status`, {
    params: { status, daysBeforeExpiry },
  });
};

// Lấy lô theo vật tư
export const getLotsBySupplyId = (medicalSupplyId, includeQuantitySummary = false) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/by-supply/${medicalSupplyId}`, {
    params: { includeQuantitySummary },
  });
};

// Get lot detail
export const getMedicalSupplyLotById = (id) => {
  return axios.get(`${BASE_URL}/MedicalSupplyLot/${id}`);
};

// Update quantity
export const updateLotQuantity = (id, quantity) => {
  return axios.patch(`${BASE_URL}/MedicalSupplyLot/${id}/quantity`, { quantity });
};
