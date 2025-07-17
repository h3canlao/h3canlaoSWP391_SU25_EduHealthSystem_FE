import axios from "axios";

const BASE_URL = "https://localhost:7096/api";

// Lấy thống kê trạng thái chiến dịch khám sức khỏe
export const getCheckupCampaignStatusStatistics = async () => {
  return axios.get(`${BASE_URL}/CheckupCampaign/statistics/status`);
};

// Lấy thống kê lịch khám theo campaignId
export const getCheckupScheduleStatistics = async (campaignId) => {
  return axios.get(`${BASE_URL}/CheckupSchedule/statistics`, {
    params: { campaignId },
  });
};

// Lấy thống kê lô vaccine
export const getVaccineLotStatistics = async () => {
  return axios.get(`${BASE_URL}/VaccineLot/statistics`);
};

// Lấy thống kê lô thuốc
export const getMedicationLotStatistics = async () => {
  return axios.get(`${BASE_URL}/MedicationLot/statistics`);
};

// Sử dụng lại hàm đã có từ service MedicalSupply để lấy vật tư tồn kho thấp
export const getLowStockMedicalSupplies = async () => {
  return axios.get(`${BASE_URL}/MedicalSupply/low-stock`);
};

// Service để lấy danh sách chiến dịch cho Selectbox
export const getCheckupCampaigns = async (params) => {
  return axios.get(`${BASE_URL}/CheckupCampaign`, { params });
};
