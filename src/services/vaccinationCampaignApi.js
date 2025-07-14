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
  // Gửi body đúng qua key `data`
  return axios.delete(`${BASE_URL}/VaccinationCampaign/batch`, {
    data: { campaignIds: ids },
  });
};

export const getDeletedVaccinationCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign/deleted`, { params });
};
export const restoreVaccinationCampaigns = async (ids) => {
  // PATCH với body: { campaignIds: [...] }
  return axios.patch(`${BASE_URL}/VaccinationCampaign/batch/restore`, {
    campaignIds: ids,
  });
};

export const updateStatusVaccinationCampaigns = async (ids, status) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/batch/status`, { ids, status });
};

export const getVaccinationCampaignDetail = (id) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign/${id}/detail`);
};

// PATCH: /api/VaccinationCampaign/{id}/start
export const startVaccinationCampaign = async (id) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/${id}/start`);
};
// PATCH: /api/VaccinationCampaign/{id}/complete
export const completeVaccinationCampaign = async (id) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/${id}/complete`);
};
// PATCH: /api/VaccinationCampaign/{id}/cancel
export const cancelVaccinationCampaign = async (id) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/${id}/cancel`);
};
