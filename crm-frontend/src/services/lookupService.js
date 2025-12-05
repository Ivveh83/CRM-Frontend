import axios from "axios";

const API_URL = "http://localhost:8080/api/lookups";
const TOKEN_KEY = "auth_token";

export const lookupService = {
  createLookupValue: async (payload) => {

    console.log("Creating lookup value with payload:", payload);
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error("Error creating lookup value:", error);
      throw error;
    }
  },

  updateLookup: async (id, payload) => {
  try {
    const token = localStorage.getItem("auth_token");

    await axios.put(
      `${API_URL}/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return true;

  } catch (error) {
    console.error("Error updating lookup:", error);
    throw error;
  }
},

  getLookupValues: async (type, activeOnly) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

    const res = await axios.get(`${API_URL}/${type}`, {
      params: { activeOnly },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching all lookup values:", error);
      throw error;
    }
  },

  updateLookupActive: async (id, active) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.patch(
        `${API_URL}/${id}/active`,
        { active },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Error updating lookup active state:", error);
      throw error;
    }
  },
  // Uppdatera sortOrder (drag-and-drop)
reorderLookupValues: async (type, updates) => {
  try {
    const token = localStorage.getItem("auth_token");

    await axios.post(
      `${API_URL}/${type}/reorder`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error reordering lookup values:", error);
    throw error;
  }
},

};
