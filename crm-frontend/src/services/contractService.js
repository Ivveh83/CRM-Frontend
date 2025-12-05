import axios from "axios";
import { get } from "react-hook-form";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/contract";

export const contractService = {
  getAllContracts: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching All Contracts: ", error);
    }
  },

  getContractById: async (contractId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(`${API_URL}/${contractId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Contract by ID: ", error);
    }
  },

  createContract: async (contractData) => {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      await axios.post(API_URL, contractData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.error("Error creating contract:", error.response?.data || error);
      throw error; // skicka vidare så React kan hantera felet
    }
  },

  updateContract: async (contractId, contractData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.put(`${API_URL}/${contractId}`, contractData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.log("Error updating contract: ", error);
      throw error;
    }
  },

  deleteContract: async (contractId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.delete(`${API_URL}/${contractId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.log("Error deleting contract: ", error);
      throw error;
    }
  },

  updateContractActive: async (id, dto) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.patch(`${API_URL}/${id}/active`, dto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.log("Error updating contracts active status: ", error);
      throw error;
    }
  },

  renewContract: async (contractId, renewalData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.patch(`${API_URL}/${contractId}/renew`, renewalData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.log("Error renewing contract: ", error);
      throw error;
    }
  },
  getContractEvents: async (contractId) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await axios.get(`${API_URL}/${contractId}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching contract events:", error);
    throw error;
  }
},
 deleteContractEvent: async (eventId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.delete(`${API_URL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error("Error deleting contract event:", error);
      throw error;
    }
  },
  deleteAllContractEvents: async (contractId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.delete(`${API_URL}/${contractId}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error("Error deleting ALL contract events:", error);
      throw error;
    }
  },
};
