import axios from "axios";

const BASE_URL = "https://localhost:7096/api"; // Giả định baseURL

export const getCheckupCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/CheckupCampaign`, { params });
};

export const createCheckupCampaign = async (data) => {
  return axios.post(`${BASE_URL}/CheckupCampaign`, data);
};

export const updateCheckupCampaign = async (id, data) => {
  return axios.put(`${BASE_URL}/CheckupCampaign/${id}`, data);
};

export const deleteCheckupCampaigns = async (ids) => {
  // Gửi body đúng qua key `data`
  return axios.post(`${BASE_URL}/CheckupCampaign/batch/delete`, { ids });
};

export const getCheckupCampaignDetail = (id) => {
  return axios.get(`${BASE_URL}/CheckupCampaign/${id}/detail`);
};

export const restoreCheckupCampaigns = async (ids) => {
  // PATCH: /api/CheckupCampaign/batch/restore
  return axios.post(`${BASE_URL}/CheckupCampaign/batch/restore`, {
    campaignIds: ids,
  });
};

export const updateStatusCheckupCampaigns = async (ids, status) => {
  // POST: /api/CheckupCampaign/batch/update-status
  return axios.post(`${BASE_URL}/CheckupCampaign/batch/update-status`, { campaignIds: ids, status });
};

export const startCheckupCampaign = async (id) => {
  return axios.post(`${BASE_URL}/CheckupCampaign/${id}/start`);
};

export const completeCheckupCampaign = async (id) => {
  return axios.post(`${BASE_URL}/CheckupCampaign/${id}/complete`);
};

export const cancelCheckupCampaign = async (id) => {
  return axios.post(`${BASE_URL}/CheckupCampaign/${id}/cancel`);
};

// Hàm lấy danh sách đã xóa, có thể dùng chung getCheckupCampaigns với param includeDeleted
// nhưng tôi sẽ tạo hàm riêng để giữ cấu trúc tương tự code mẫu của bạn
export const getDeletedCheckupCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/CheckupCampaign`, { params: { ...params, includeDeleted: true } });
};
