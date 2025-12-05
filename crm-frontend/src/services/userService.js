import axios from "axios";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/user";

export const userService = {
  // -----------------------------------------------------
  // GET ALL USERS (Admin)
  // -----------------------------------------------------
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Error fetching users: ", error);
      throw error;
    }
  },

  // -----------------------------------------------------
  // REGISTER USER (Public)
  // -----------------------------------------------------
  registerUser: async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("User registration failed:", error);
      throw error;
    }
  },

  // -----------------------------------------------------
  // CHANGE PASSWORD (Admin or Self)
  // Now matches:
  // PATCH /api/user/password
  // Body: { username, oldPassword, newPassword }
  // -----------------------------------------------------
  changePassword: async (username, dto) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Ingen inloggning hittades. Logga in på nytt.");

      // dto should contain { oldPassword, newPassword }
      const requestBody = { username, ...dto };

      const response = await axios.patch(
        `${API_URL}/password`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || error.response?.data || error.message;

      throw new Error(backendMessage || "Lösenordsbyte misslyckades.");
    }
  },

  // -----------------------------------------------------
  // UPDATE USER (Admin)
  // Now matches:
  // PUT /api/user
  // Body: UserEntityDto
  // -----------------------------------------------------
  updateUser: async (userData) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await axios.put(`${API_URL}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error updating user: ", error);
      throw error;
    }
  },

  // -----------------------------------------------------
  // ADD ROLE TO USER (Admin)
  // Matches:
  // POST /api/user/addRoleToUser
  // Body: { userId, roleName }
  // -----------------------------------------------------
  addRoleToUser: async (id, role) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.post(
        `${API_URL}/addRoleToUser`,
        { userId: id, roleName: role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log("Error adding role to user: ", error);
      throw error;
    }
  },

  // -----------------------------------------------------
  // REMOVE ROLE FROM USER (Admin)
  // NEW:
  // DELETE /api/user/role
  // Body: { userId, roleName }
  // -----------------------------------------------------
  removeRoleFromUser: async (userId, roleName) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.delete(`${API_URL}/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { userId, roleName }, // IMPORTANT: DELETE must use "data"
      });
    } catch (error) {
      console.error("Error removing role from user:", error);
      throw error;
    }
  },

  // -----------------------------------------------------
  // DELETE USER (Admin)
  // Path parameter still correct
  // -----------------------------------------------------
  deleteUser: async (id) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log("Error deleting user: ", error);
      throw error;
    }
  },
};
