import axios from "axios";
const BASE_URL = "https://localhost:7096/api";
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// VaccineType
export const getVaccineTypes = (params) => axios.get(`${BASE_URL}/VaccineType`, { params });

export const createVaccineType = (data) => axios.post(`${BASE_URL}/VaccineType`, data);

export const updateVaccineType = (id, data) => axios.put(`${BASE_URL}/VaccineType/${id}`, data);

export const deleteVaccineTypes = (ids, isPermanent = false) =>
  axios.delete(`${BASE_URL}/VaccineType`, {
    data: { ids, isPermanent },
  });

export const getDeletedVaccineTypes = (params) => axios.get(`${BASE_URL}/VaccineType/deleted`, { params });

export const restoreVaccineTypes = (ids) =>
  axios.post(`${BASE_URL}/VaccineType/restore`, { ids }, { headers: getAuthHeaders() });

export const toggleVaccineTypeStatus = (id) => axios.patch(`${BASE_URL}/VaccineType/${id}/toggle-status`);
// VaccineLot
// VaccineLot APIs
export const getVaccineLots = (params) => axios.get(`${BASE_URL}/VaccineLot`, { params });

export const getVaccineLotById = (id) => axios.get(`${BASE_URL}/VaccineLot/${id}`);

export const createVaccineLot = (data) => axios.post(`${BASE_URL}/VaccineLot`, data);

export const updateVaccineLot = (id, data) => axios.put(`${BASE_URL}/VaccineLot/${id}`, data);

export const batchDeleteVaccineLot = (ids) => axios.post(`${BASE_URL}/VaccineLot/batch/delete`, { ids });

export const batchRestoreVaccineLot = (ids) =>
  axios.post(`${BASE_URL}/VaccineLot/batch/restore`, { ids }, { headers: getAuthHeaders() });

export const patchVaccineLotQuantity = (id, quantity) =>
  axios.patch(`${BASE_URL}/VaccineLot/${id}/quantity`, { quantity });

export const getVaccineLotStatistics = () => axios.get(`${BASE_URL}/VaccineLot/statistics`);
// VaccineDoseInfo
export const getVaccineDoseInfos = (params) => axios.get(`${BASE_URL}/VaccineDoseInfo`, { params });

export const createVaccineDoseInfo = (data) => axios.post(`${BASE_URL}/VaccineDoseInfo`, data);

export const updateVaccineDoseInfo = (id, data) => axios.put(`${BASE_URL}/VaccineDoseInfo/${id}`, data);

export const deleteVaccineDoseInfos = (ids) => axios.delete(`${BASE_URL}/VaccineDoseInfo`, { data: { ids } });

export const getVaccineDoseInfoDetail = (id) => axios.get(`${BASE_URL}/VaccineDoseInfo/${id}/detail`);

export const getNextDoseInfo = (vaccineTypeId, currentDoseNumber) =>
  axios.get(`${BASE_URL}/VaccineDoseInfo/next-dose/${vaccineTypeId}/${currentDoseNumber}`);

// vaccineManagerApi.js
export const getVaccineTypeDetail = (id) => axios.get(`${BASE_URL}/VaccineType/${id}/detail`);
