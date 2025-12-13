const TOKEN_KEY = "auth_token";
const API_URL = "http://localhost:8080/api/ai";

export const aiService = {

  /**
   * Send a prompt to the AI and receive a streamed response.
   *
   * @param {Object} request DynamicAiRequest
   * @param {Function} onChunk callback for each streamed chunk
   * @param {Function} onComplete optional callback when stream ends
   */
  chat: async (request, onChunk) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    // Stream handling
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;

    while (!done) {
      const result = await reader.read();
      done = result.done;

      if (result.value) {
        const chunk = decoder.decode(result.value, { stream: true });
        onChunk(chunk);
      }
    }
    const remaining = decoder.decode(); // flush decoder
        if (remaining) {
      onChunk(remaining);
    }
  },
};
