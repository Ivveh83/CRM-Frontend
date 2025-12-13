import axios from "axios";

const TOKEN_KEY = "auth_token";
const API_URL = "http://localhost:8080/api/chat";

export const aiService = {
  /**
   * Send a prompt to the AI and receive a full string response.
   *
   * @param {Object} request DynamicAiRequest
   * @returns {Promise<string>} AI response text
   */
  chat: async (request) => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const response = await axios.post(
        `${API_URL}/ask`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "text", // 🔒 garanterar string
        }
      );

      console.log("AI response:", response.data);
      return response.data;
    } catch (error) {
      console.error("AI request failed", error);
      throw new Error("AI request failed");
    }
  },
};

