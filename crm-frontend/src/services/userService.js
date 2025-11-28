const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://localhost:8080/api/user";

export const userService = {
  changePassword: async (username, dto) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        throw new Error("Ingen inloggning hittades. Logga in på nytt.");
      }

      const response = await fetch(`${API_URL}/${username}/password`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto), // { currentPassword, newPassword }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Kunde inte uppdatera lösenordet.");
      }

      return await response.text(); // Backend returnerar text
    } catch (error) {
      throw new Error(error.message || "Lösenordsbyte misslyckades.");
    }
  },
};
