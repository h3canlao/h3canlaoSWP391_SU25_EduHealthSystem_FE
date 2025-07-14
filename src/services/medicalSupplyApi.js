import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

export const getMedicalSupplies = async (params) => {
  return axios.get(`${BASE_URL}/MedicalSupply`, { params });
};

export const getMedicalSupplyById = async (id) => {
  return axios.get(`${BASE_URL}/MedicalSupply/${id}?includeLots=true`);
};

export const createMedicalSupply = async (data) => {
  return axios.post(`${BASE_URL}/MedicalSupply`, data);
};

export const updateMedicalSupply = async (id, data) => {
  return axios.put(`${BASE_URL}/MedicalSupply/${id}`, data);
};

// Xóa nhiều/xóa mềm/xóa vĩnh viễn (body: { ids: [...], isPermanent: bool })
export const deleteMedicalSupplies = async (ids, isPermanent = false) => {
  return axios.delete(`${BASE_URL}/MedicalSupply`, {
    data: { ids, isPermanent },
  });
};

export const restoreMedicalSupplies = async (ids) => {
  return axios.post(`${BASE_URL}/MedicalSupply/restore`, { ids });
};

export const getLowStockMedicalSupplies = async () => {
  return axios.get(`${BASE_URL}/MedicalSupply/low-stock`);
};
