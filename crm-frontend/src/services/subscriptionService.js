import axios from "axios";
import { get } from "react-hook-form";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/subscription";

export const subscriptionService = {

    getAllSubscriptionDtos: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching subscriptions: ", error);
      throw error;
    }
  },

  getAllSubscriptionsForContractComponentsDto: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(`${API_URL}/getAllSubscriptionsForContractComponents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching subscriptions: ", error);
      throw error;
    }
  },

  getSubscriptionById: async (subscriptionId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(`${API_URL}/${subscriptionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("Error fetching Subscription by ID: ", error);
    }
  },

  createSubscription: async (subscriptionData) => {
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const response = await axios.post(API_URL, subscriptionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.error(
        "Error creating subscription:",
        error.response?.data || error
      );
      throw error;
    }
  },

  updateSubscription: async (subscriptionId, subscriptionData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.put(
        `${API_URL}/${subscriptionId}`,
        subscriptionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      console.log("Error updating subscription: ", error);
      throw error;
    }
  },

  deleteSubscription: async (subscriptionId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const response = await axios.delete(`${API_URL}/${subscriptionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error) {
      console.log("Error deleting subscription: ", error);
      throw error;
    }
  },
  
  updateSubscriptionActive: async (id, active) => {
  try {
    const token = localStorage.getItem("auth_token");

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
    console.log("Error updating subscription active status: ", error);
    throw error;
  }
},
 getSubscriptionEvents: async (subscriptionId) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await axios.get(`${API_URL}/${subscriptionId}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching subscription events:", error);
      throw error;
    }
  },
  deleteSubscriptionEvent: async (eventId) => {
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
    console.error("Error deleting event:", error);
    throw error;
  }
},

deleteAllSubscriptionEvents: async (subscriptionId) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    await axios.delete(`${API_URL}/${subscriptionId}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return true;
  } catch (error) {
    console.error("Error deleting ALL events:", error);
    throw error;
  }
},

};
