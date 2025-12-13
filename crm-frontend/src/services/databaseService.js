// src/services/databaseService.js
import axios from "axios";
import { extractErrorMessage } from "../utils/errorutils.js";

const TOKEN_KEY = "auth_token";
const API_URL = "http://localhost:8080/api/db";

export const databaseService = {
  // ===============================
  // LISTA DATABASE CONNECTIONS
  // GET /api/db/connections
  // ===============================
  getAllConnections: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.get(`${API_URL}/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching database connections:", error);
      throw extractErrorMessage(error);
    }
  },

  // ===============================
  // SKAPA DATABASE CONNECTION
  // POST /api/db/connections
  // ===============================
  createConnection: async (connectionData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      console.log("Creating connection with data:", connectionData);
      const response = await axios.post(
        `${API_URL}/connections`,
        connectionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating database connection:", error);
      throw extractErrorMessage(error);
    }
  },

  // ===============================
  // CONNECT TO DATABASE
  // POST /api/db/connect/{id}
  // ===============================
  connectToDatabase: async (connectionId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.post(
        `${API_URL}/connect/${connectionId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { token: newToken } = response.data;

      console.log("New token received:", newToken);

      // ✅ ersätt token globalt
      localStorage.setItem(TOKEN_KEY, newToken);

      return response.data;
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw extractErrorMessage(error);
    }
  },

 // ===============================
  // DISCONNECT FROM DATABASE
  // POST /api/db/dissconnect
  // ===============================
  disconnectFromDatabase: async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await axios.post(
      `${API_URL}/disconnect`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { token: newToken } = response.data;

    // 🔥 ersätt token & rensa aktiv DB
    localStorage.setItem(TOKEN_KEY, newToken);

    return true;
  } catch (error) {
    throw extractErrorMessage(error);
  }
},


  // ===============================
  // DELETE DATABASE CONNECTION
  // DELETE /api/db/connections/{id}
  // ===============================
  deleteConnection: async (connectionId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.delete(`${API_URL}/connections/${connectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting database connection:", error);
      throw extractErrorMessage(error);
    }
  },
};
