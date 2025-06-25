// vaccinationHelperApi.js
import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

export const getGrades = () => {
  return axios.get(`${BASE_URL}/StudentHelper?type=grades`);
};

export const getStudentsByGradeSection = (grades = [], sections = []) => {
  return axios.get(`${BASE_URL}/StudentHelper`, {
    params: {
      type: "students",
      grades,
      sections,
    },
  });
};
