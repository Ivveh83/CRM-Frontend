import React, { useEffect, useState } from "react";
import { databaseService } from "../../services/databaseService";
import { SiSqlite } from "react-icons/si";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

export default function DatabaseManager() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const { activeDbKey, setActiveDbKey } = useAuth();
  const hasActiveDatabase = Boolean(activeDbKey);

  const { register, handleSubmit, reset, formState } = useForm();

  const safeError = (err, fallback = "Ett oväntat fel uppstod.") =>
    err?.response?.data?.message || err?.message || fallback;

  // -----------------------------------
  // Load connections
  // -----------------------------------
  const loadConnections = async () => {
    try {
      setLoading(true);
      const res = await databaseService.getAllConnections();
      setConnections(res || []);
    } catch (err) {
      setServerError(safeError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  // -----------------------------------
  // Create
  // -----------------------------------
  const onCreate = async (data) => {
    try {
      const filePath = data.filePath?.trim();
      if (!filePath) return setServerError("Absolut filsökväg krävs.");

      await databaseService.createConnection({
        type: "sqlite",
        filePath,
      });

      reset();
      loadConnections();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // -----------------------------------
  // Connect / Disconnect
  // -----------------------------------
  const connect = async (id) => {
    try {
      await databaseService.connectToDatabase(id);
      setActiveDbKey(`conn_${id}`);
      loadConnections();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  const disconnect = async () => {
    try {
      await databaseService.disconnectFromDatabase();
      setActiveDbKey(null);
      loadConnections();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // -----------------------------------
  // Delete
  // -----------------------------------
  const remove = async (id) => {
    try {
      await databaseService.deleteConnection(id);
      loadConnections();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Databashantering
      </h2>

      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-[#E35C67] rounded-lg">
          {serverError}
        </div>
      )}

      {/* ---------------------------
          LIST
      --------------------------- */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#165C6D] text-white text-left">
              <th className="py-3 px-4">Databas</th>
              <th className="py-3 px-4 w-48 text-right">Åtgärder</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-gray-500">
                  Laddar…
                </td>
              </tr>
            ) : connections.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-gray-500">
                  Inga databaser registrerade
                </td>
              </tr>
            ) : (
              connections.map((c) => {
                const isActive = activeDbKey === `conn_${c.id}`;

                return (
                  <tr
                    key={c.id}
                    className={`border-b ${
                      isActive ? "bg-green-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <SiSqlite className="text-blue-600" />
                        <span className="font-medium">{c.filePath}</span>
                        {isActive && (
                          <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                            Aktiv
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {c.id}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {!isActive && !hasActiveDatabase && (
                          <button
                            onClick={() => connect(c.id)}
                            className="px-4 py-1.5 bg-[#165C6D] text-white rounded hover:bg-[#0f3f4b]"
                          >
                            Anslut
                          </button>
                        )}

                        {isActive && (
                          <button
                            onClick={disconnect}
                            className="px-4 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Frånkoppla
                          </button>
                        )}

                        <button
                          disabled={isActive}
                          onClick={() => remove(c.id)}
                          className={`px-4 py-1.5 rounded text-white ${
                            isActive
                              ? "bg-red-300 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Ta bort
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------------------
          CREATE
      --------------------------- */}
      <h3 className="text-lg font-semibold text-[#165C6D] mb-3">
        Lägg till SQLite-databas
      </h3>

      <form
        onSubmit={handleSubmit(onCreate)}
        className={`flex gap-3 ${
          hasActiveDatabase ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input
          type="text"
          placeholder="Absolut filsökväg, t.ex. C:\Users\YourName\Documents\crm\db1.db
"
          {...register("filePath", { required: true })}
          className="border px-4 py-2 rounded-lg w-full"
        />

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="bg-[#165C6D] hover:bg-[#0f3f4b] text-white px-5 py-2 rounded-lg font-semibold shadow"
        >
          {formState.isSubmitting ? "Skapar…" : "Lägg till"}
        </button>
      </form>
    </div>
  );
}
