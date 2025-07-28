import axios from "axios";
const BASE_URL = "https://localhost:7096/api";
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
// Lấy tất cả học sinh
export const getStudents = () => axios.get(`${BASE_URL}/students`, { headers: getAuthHeaders() });

// Lấy danh sách khối/lớp (như bạn gửi)
export const getGrades = () => axios.get(`${BASE_URL}/StudentHelper?type=grades`, { headers: getAuthHeaders() });

export const getSections = () => axios.get(`${BASE_URL}/StudentHelper?type=sections`);
