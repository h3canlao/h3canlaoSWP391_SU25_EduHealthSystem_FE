import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

export const getVaccinationSchedules = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationSchedule`, { params });
};

export const createVaccinationSchedule = async (data) => {
  return axios.post(`${BASE_URL}/VaccinationSchedule`, data);
};

export const updateVaccinationSchedule = async (id, data) => {
  return axios.put(`${BASE_URL}/VaccinationSchedule/${id}`, data);
};

export const deleteVaccinationSchedules = async (ids, isPermanent = false) => {
  return axios.delete(`${BASE_URL}/VaccinationSchedule/batch`, {
    data: ids,
    params: { isPermanent },
  });
};

export const getDeletedVaccinationSchedules = async (params) => {
  return axios.get(`${BASE_URL}/VaccinationSchedule/deleted`, { params });
};

export const restoreVaccinationSchedules = async (ids) => {
  return axios.patch(`${BASE_URL}/VaccinationSchedule/batch/restore`, ids);
};

export const updateStatusVaccinationSchedules = async (ids, status) => {
  return axios.patch(`${BASE_URL}/VaccinationSchedule/batch/status`, { ids, status });
};
