import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "../../services/subscriptionService";
import { useSubscriptionFilters } from "./useSubscriptionFilters";
import SubscriptionFilters from "./SubscriptionFilters";

export default function SubscriptionsList() {
  const [filters, setFilters] = useState({
  search: "",
  category: "ALL",
  serviceLevel: "ALL",
  active: "ALL",
  sortField: "name",
  sortDirection: "asc",
});

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const navigate = useNavigate();

  // Fetch subscriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await subscriptionService.getAllSubscriptionDtos();

        // ✔ Allt hålls som camelCase
        setSubs(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubs = useSubscriptionFilters(subs, filters);
  const handleDeleteClick = (sub) => {
    setSelectedSub(sub);
    setShowModal(true);
  };

const confirmDelete = async () => {
  if (!selectedSub) return;

  try {
    // 🔵 Anropa backend för hard delete
    await subscriptionService.deleteSubscription(selectedSub.id);

    // 🟢 Ta bort från UI
    setSubs((prev) => prev.filter((s) => s.id !== selectedSub.id));

    // Stäng modal & nollställ
    setShowModal(false);
    setSelectedSub(null);

  } catch (error) {
    console.error("Kunde inte radera abonnemang:", error);

    alert(
      error.response?.data?.message ||
      "Det gick inte att radera abonnemanget."
    );
  }
};


  const toggleActive = async (sub) => {
    const newActive = !sub.active;

    try {
      await subscriptionService.updateSubscriptionActive(sub.id, newActive);

      // Optimistic UI update
      setSubs((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, active: newActive } : s))
      );
    } catch (error) {
      console.error("Kunde inte uppdatera abonnemangets status:", error);
      alert("Misslyckades med att ändra status.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-4">Abonnemang</h2>
<SubscriptionFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-gray-700 py-4">Laddar abonnemang...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full border-collapse table-auto text-sm">
            <thead>
              <tr className="bg-[#165C6D] text-white text-left">
                <th className="py-3 px-4">Namn</th>
                <th className="py-3 px-2 whitespace-nowrap">Kategori</th>
                <th className="py-3 px-2 whitespace-nowrap">Service-nivå</th>
                <th className="py-3 px-2 whitespace-nowrap">Pris</th>
                <th className="py-3 px-2 whitespace-nowrap">Längd</th>
                <th className="py-3 px-2 whitespace-nowrap">Status</th>
                <th className="py-3 px-2 whitespace-nowrap">Support</th>
                <th className="py-3 px-2 whitespace-nowrap">Skapad</th>
                <th className="py-3 px-4 text-right">Åtgärder</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubs.map((s, index) => (
                <tr
                  key={s.id}
                  className={`border-b transition ${
                    !s.active
                      ? "bg-yellow-50 hover:bg-yellow-100"
                      : index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Namn + kort beskrivning */}
                  <td className="py-3 px-4 font-medium text-[#165C6D]">
                    <div>{s.name}</div>
                    <div className="text-xs text-gray-500 max-w-[200px] truncate">
                      {s.description}
                    </div>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">{s.category}</td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        s.serviceLevel?.toLowerCase() ===
                        "platinum (dedikerad soc)"
                          ? "bg-yellow-100 text-yellow-800"
                          : s.serviceLevel?.toLowerCase() ===
                            "gold (24/7 support)"
                          ? "bg-orange-100 text-orange-800"
                          : s.serviceLevel?.toLowerCase() ===
                            "silver (12/5 support)"
                          ? "bg-blue-100 text-blue-800"
                          : s.serviceLevel?.toLowerCase() ===
                            "bronze (kontorstid)"
                          ? "bg-gray-300 text-gray-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {s.serviceLevel}
                    </span>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap font-medium">
                    {s.pricePerMonth?.toLocaleString()} kr
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    {s.contractLength} mån
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        s.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.active ? "Aktivt" : "Inaktivt"}
                    </span>
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap text-sm">
                    {s.supportContact}
                  </td>

                  <td className="py-3 px-2 whitespace-nowrap text-sm text-gray-500">
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString("sv-SE")
                      : "-"}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      {/* TOGGLE ACTIVE */}
                      <button
                        className={`px-3 py-1 text-xs font-semibold transition ${
                          s.active
                            ? "bg-amber-300 hover:bg-amber-400 text-[#165C6D] rounded-xl"
                            : "bg-[#D48A62] hover:bg-[#BC7754] text-white rounded-full"
                        }`}
                        onClick={() => toggleActive(s)}
                      >
                        {s.active ? "Inaktivera" : "Aktivera"}
                      </button>

                      {/* SE INFO */}
                      <button
                        className="bg-[#CBD5D8] hover:bg-[#B7C4C8] text-[#165C6D] px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        onClick={() =>
                          navigate(`/subscriptions/${s.id}`, {
                            state: { subscription: s },
                          })
                        }
                      >
                        <Eye size={14} /> Se info
                      </button>

                      {/* UPDATE */}
                      <button
                        className="bg-[#6A6FA3] hover:bg-[#565A89] text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1"
                        onClick={() =>
                          navigate(`/subscriptions/update/${s.id}`, {
                            state: { subscription: s },
                          })
                        }
                      >
                        <Pencil size={14} /> Uppdatera
                      </button>

                      {/* DELETE */}
                      <button
                        className="bg-[#E35C67] hover:bg-[#C94F59] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1"
                        onClick={() => handleDeleteClick(s)}
                      >
                        <Trash2 size={14} /> Radera
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && selectedSub && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Bekräfta borttagning
            </h3>
            <p className="text-gray-700 mb-6">
              Är du säker på att du vill radera abonnemanget{" "}
              <span className="font-mono font-semibold text-[#E35C6D]">
                {selectedSub.name}
              </span>
              ?
              <br />
              Denna åtgärd raderar abonnemanget <b>från samtliga kontrakt</b> och <b>går inte att ångra</b>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Avbryt
              </button>

              <button
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={confirmDelete}
              >
                Radera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
