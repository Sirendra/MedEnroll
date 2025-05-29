import axios from "../../../api/axiosClient";

const API_URL = "/api/auth";

export const registerAdmin = (data) => axios.post(`${API_URL}/register`, data);
export const loginAdmin = (data) => axios.post(`${API_URL}/login`, data);
