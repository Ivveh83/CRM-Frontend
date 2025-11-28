import axios from "axios";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/reseller";

export const resellerService = {

    getAllResellers: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching resellers: ", error);
      throw error;
    }
  },

  getAllResellersForContractComponents: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.get(`${API_URL}/getAllResellersForContractComponents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching resellers: ", error);
      throw error;
    }
  },

    getResellerById: async (resellerId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.get(`${API_URL}/${resellerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Reseller by ID: ", error);
    }
  },

  createReseller: async (resellerData) => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      await axios.post(API_URL, resellerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error(
        "Error creating reseller:",
        error.response?.data || error
      );
      throw error;
    }
  },

  updateReseller: async (resellerId, resellerData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.put(
        `${API_URL}/${resellerId}`,
        resellerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.log("Error updating reseller: ", error);
      throw error;
    }
  },

  deleteReseller: async (resellerId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.delete(`${API_URL}/${resellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.log("Error deleting reseller: ", error);
      throw error;
    }
  },

updateResellerActive: async (id, active) => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.patch(
      `${API_URL}/${id}/active`,
      { active: active },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // förväntas vara den uppdaterade ResellerResponseDto
  } catch (error) {
    console.log("Error updating reseller active status:", error);
    throw error;
  }
},


};
