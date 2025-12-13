import axios from "axios";

const TOKEN_KEY = "auth_token";
const API_URL = "http://localhost:8080/api/admin/data-initializer";

export const dataInitializerService = {
  generateDemoData: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.post(
        `${API_URL}/generate`,
        {}, // ingen body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "text", // VIKTIGT – backend returnerar String
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error generating demo data:", error);
      throw error;
    }
  },
};
