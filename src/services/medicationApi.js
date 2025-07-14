import axios from "axios";

const BASE_URL = "https://localhost:7096/api";

export const getMedications = async (params) => {
  return axios.get(`${BASE_URL}/Medication`, { params });
};

export const createMedication = async (data) => {
  return axios.post(`${BASE_URL}/Medication`, data);
};

export const updateMedication = async (id, data) => {
  return axios.put(`${BASE_URL}/Medication/${id}`, data);
};

export const deleteMedication = async (ids, isPermanent = false) => {
  // ids là mảng, ví dụ: [id] hoặc [id1, id2]
  return axios.delete(`${BASE_URL}/Medication`, {
    data: { ids, isPermanent },
  });
};
export const restoreMedications = async (ids) => {
  return axios.post(`${BASE_URL}/Medication/restore`, { ids });
};
export const getMedicationCategories = async () => {
  return axios.get(`${BASE_URL}/Medication/categories`);
};

export const getActiveMedications = async (params) => {
  return axios.get(`${BASE_URL}/Medication/active`, { params });
};

export const getDeletedMedications = async (params) => {
  return axios.get(`${BASE_URL}/Medication/deleted`, { params });
};

export const getMedicationById = (id) => {
  return axios.get(`${BASE_URL}/Medication/${id}`);
};
