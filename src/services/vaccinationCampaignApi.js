import axios from "axios";

// Hàm lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BASE_URL = "https://localhost:7096/api";

export const getVaccinationCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign`, {
    params,
    headers: getAuthHeaders(),
  });
};

export const createVaccinationCampaign = async (data) => {
  return axios.post(`${BASE_URL}/VaccinationCampaign`, data, {
    headers: getAuthHeaders(),
  });
};

export const updateVaccinationCampaign = async (id, data) => {
  return axios.put(`${BASE_URL}/VaccinationCampaign/${id}`, data, {
    headers: getAuthHeaders(),
  });
};

export const deleteVaccinationCampaign = async (ids) => {
  // Gửi body đúng qua key `data`
  return axios.delete(`${BASE_URL}/VaccinationCampaign/batch`, {
    data: { campaignIds: ids },
    headers: getAuthHeaders(),
  });
};

export const getDeletedVaccinationCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign/deleted`, {
    params,
    headers: getAuthHeaders(),
  });
};

export const restoreVaccinationCampaigns = async (ids) => {
  // PATCH với body: { campaignIds: [...] }
  return axios.patch(
    `${BASE_URL}/VaccinationCampaign/batch/restore`,
    {
      campaignIds: ids,
    },
    {
      headers: getAuthHeaders(),
    }
  );
};

export const updateStatusVaccinationCampaigns = async (ids, status) => {
  return axios.patch(
    `${BASE_URL}/VaccinationCampaign/batch/status`,
    {
      ids,
      status,
    },
    {
      headers: getAuthHeaders(),
    }
  );
};

export const getVaccinationCampaignDetail = (id) => {
  return axios.get(`${BASE_URL}/VaccinationCampaign/${id}/detail`, {
    headers: getAuthHeaders(),
  });
};

// PATCH: /api/VaccinationCampaign/{id}/start
export const startVaccinationCampaign = async (id) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/${id}/start`, null, {
    headers: getAuthHeaders(),
  });
};

// PATCH: /api/VaccinationCampaign/{id}/complete
export const completeVaccinationCampaign = async (id) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/${id}/complete`, null, {
    headers: getAuthHeaders(),
  });
};

// PATCH: /api/VaccinationCampaign/{id}/cancel
export const cancelVaccinationCampaign = async (id) => {
  return axios.patch(`${BASE_URL}/VaccinationCampaign/${id}/cancel`, null, {
    headers: getAuthHeaders(),
  });
};
