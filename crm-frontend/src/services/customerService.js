import axios from "axios";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/customer";

export const customerService = {

    getAllCustomerResponseDtos: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching customers: ", error);
      throw error;
    }
  },

  getAllCustomersForContractComponents: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.get(`${API_URL}/getAllCustomersForContractComponents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching customers: ", error);
      throw error;
    }
  },

    getCustomerById: async (customerId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(`${API_URL}/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Customer by ID: ", error);
    }
  },

  createCustomer: async (customerData) => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      await axios.post(API_URL, customerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error(
        "Error creating customer:",
        error.response?.data || error
      );
      throw error;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.put(
        `${API_URL}/${customerId}`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.log("Error updating customer: ", error);
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.delete(`${API_URL}/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.log("Error deleting customer: ", error);
      throw error;
    }
  },
};
