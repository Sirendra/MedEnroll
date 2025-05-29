import axios from "../../../api/axiosClient";

const API_URL = "/api/customers";

export const searchByName = (searchText) => {
  return axios.get(API_URL, {
    params: { fullName: searchText },
  });
};

export const getRecentActivities = (limit) => {
  return axios.get(API_URL, {
    params: { limit },
  });
};
