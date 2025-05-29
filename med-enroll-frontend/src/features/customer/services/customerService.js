import axios from "../../../api/axiosClient";
import Fuse from "fuse.js";

const API_URL = "/api/customers";

export const addCustomer = (data) => axios.post(API_URL, data);

export const updateCustomer = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const searchAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data.data;
  } catch (error) {
    console.error("Error searching all customers:", error);
    throw error;
  }
};

export const fetchPossibleCustomers = async (firstName, lastName) => {
  try {
    const response = await axios.post(`${API_URL}/filters`, {
      firstName,
      lastName,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error searching customers:", error);
    return [];
  }
};

export const fuzzyMatchCustomers = (possibleCustomers, firstName, lastName) => {
  const fuse = new Fuse(possibleCustomers, {
    threshold: 0.3,
    distance: 100,
    minMatchCharLength: 2,
    keys: [
      { name: "firstName", weight: 0.5 },
      { name: "lastName", weight: 0.5 },
    ],
  });

  const result = fuse.search({
    firstName,
    lastName,
  });
  const matches = result.map((matchedData) => matchedData.item);
  return matches;
};
