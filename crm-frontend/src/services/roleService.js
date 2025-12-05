  import axios from "axios";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/role";

export const roleService = {
  
  getAllRoles: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching roles: ", error);
      throw error;
    }
  },
    createRole: async (roleData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.post(`${API_URL}`, roleData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
    },
    deleteRole: async (roleId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      await axios.delete(`${API_URL}/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    }
    },
};