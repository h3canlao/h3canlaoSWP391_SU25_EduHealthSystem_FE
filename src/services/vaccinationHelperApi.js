import axios from "axios";
const BASE_URL = "https://localhost:7096/api";

// Lấy tất cả học sinh
export const getStudents = () => axios.get(`${BASE_URL}/students`);

// Lấy danh sách khối/lớp (như bạn gửi)
export const getGrades = () => axios.get(`${BASE_URL}/StudentHelper?type=grades`);

export const getSections = () => axios.get(`${BASE_URL}/StudentHelper?type=sections`);
