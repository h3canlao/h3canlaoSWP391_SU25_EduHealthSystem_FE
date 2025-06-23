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

export const deleteMedication = async (id) => {
  return axios.delete(`${BASE_URL}/Medication/${id}`);
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
