import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

export const getVaccinationCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign`, { params });
};

export const createVaccinationCampaign = async (data) => {
  return axios.post(`${BASE_URL}/VaccinationCampaign`, data);
};

export const updateVaccinationCampaign = async (id, data) => {
  return axios.put(`${BASE_URL}/VaccinationCampaign/${id}`, data);
};

export const deleteVaccinationCampaign = async (ids) => {
  // DELETE batch, payload là array id
  return axios.delete(`${BASE_URL}/VaccinationCampaign/batch`, { data: ids });
};

export const getDeletedVaccinationCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign/deleted`, { params });
};

export const restoreVaccinationCampaigns = async (ids) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/batch/restore`, ids);
};

export const updateStatusVaccinationCampaigns = async (ids, status) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/batch/status`, { ids, status });
};
