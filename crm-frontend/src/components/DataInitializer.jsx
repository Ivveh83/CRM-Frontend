import { useState } from "react";
import { dataInitializerService } from "../services/dataInitializerService";

export default function DataInitializer() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await dataInitializerService.generateDemoData();
      setMessage(result);
    } catch (err) {
      setError(
        err?.response?.data ||
        err?.message ||
        "Failed to generate demo data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Demo Data</h3>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating…" : "Generate demo data"}
      </button>

      {message && (
        <p style={{ color: "green", marginTop: "1rem" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}
