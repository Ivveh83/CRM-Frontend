import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, PauseCircle, CheckCircle } from "lucide-react";
import { resellerService } from "../../services/resellerService";

export default function ResellerList() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const navigate = useNavigate();

  // 🔥 HÄMTA ÅTERFÖRSÄLJARE
  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const data = await resellerService.getAllResellers();
        setResellers(data);
      } catch (err) {
        console.error("Error fetching resellers:", err);
        setError("Kunde inte hämta återförsäljare.");
      } finally {
        setLoading(false);
      }
    };

    fetchResellers();
  }, []);


  // 🔁 AKTIVERA / INAKTIVERA
const toggleActive = async (reseller) => {
  try {
    const newActive = !reseller.active;

    await resellerService.updateResellerActive(reseller.id, newActive);

    // 🟢 Uppdatera FE direkt
    setResellers((prev) =>
      prev.map((r) =>
        r.id === reseller.id ? { ...r, active: newActive } : r
      )
    );

  } catch (error) {
    console.error("Kunde inte ändra status:", error);
    alert("Misslyckades med att ändra status.");
  }
};


  // 🗑️ ÖPPNA MODAL
  const handleDeleteClick = (reseller) => {
    setSelectedReseller(reseller);
    setShowModal(true);
  };

  // 🗑️ RADERA
  const confirmDelete = async () => {
    if (!selectedReseller) return;

    try {
      await resellerService.deleteReseller(selectedReseller.id);

      setResellers((prev) => prev.filter((c) => c.id !== selectedReseller.id));
    } catch (error) {
      console.error("Fel vid radering:", error);
      alert("Kunde inte radera reseller.");
    }

    setShowModal(false);
    setSelectedReseller(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-4">Återförsäljare</h2>

      {loading && <div className="text-gray-700 py-4">Laddar återförsäljare...</div>}
      {error && <div className="text-red-600 py-4">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#165C6D] text-white text-left">
                <th className="py-3 px-4">Namn</th>
                <th className="py-3 px-4">Org.nr</th>
                <th className="py-3 px-4">Adress</th>
                <th className="py-3 px-4">E-post</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Fakturareferens</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Skapad</th>
                <th className="py-3 px-4 text-right">Åtgärder</th>
              </tr>
            </thead>

            <tbody>
              {resellers.map((r, index) => (
                <tr
                  key={r.id}
                  className={`border-b transition ${
                    !r.active
                      ? "bg-yellow-50 hover:bg-yellow-100" // 🟨 gula rader för inaktiva
                      : index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-[#165C6D]">{r.name}</td>
                  <td className="py-3 px-4">{r.orgNo}</td>
                  <td className="py-3 px-4">{r.address}</td>
                  <td className="py-3 px-4">{r.contactEmail}</td>
                  <td className="py-3 px-4">{r.contactTelephone}</td>
                  <td className="py-3 px-4">{r.invoiceReference}</td>

                  {/* 🟨 STATUS-KOLUMN */}
                  <td className="py-3 px-4">
                    {!r.active ? (
                      <span className="flex items-center text-yellow-700 font-semibold">
                        <PauseCircle size={16} className="mr-1" /> Inaktiv
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle size={16} className="mr-1" /> Aktiv
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">{r.createdAt}</td>

                  {/* ÅTGÄRDER */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap justify-end gap-2">

                      {/* TOGGLE ACTIVE */}
                      <button
                        className={`px-3 py-1 text-xs font-semibold transition ${
                          r.active
                            ? "bg-amber-300 hover:bg-amber-400 text-[#165C6D] rounded-xl"
                            : "bg-[#D48A62] hover:bg-[#BC7754] text-white rounded-full"
                        }`}
                        onClick={() => toggleActive(r)}
                      >
                        {r.active ? "Inaktivera" : "Aktivera"}
                      </button>

                                            {/* SE INFO */}
                      <button
                        className="bg-[#CBD5D8] hover:bg-[#B7C4C8] text-[#165C6D] px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        onClick={() => navigate(`/resellers/${r.id}`)}
                      >
                        <Eye size={14} /> Se info
                      </button>

                      {/* UPPDATERA */}
                      <button
                        className="bg-[#6A6FA3] hover:bg-[#565A89] text-white px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1"
                        onClick={() =>
                          navigate(`/resellers/update/${r.id}`, {
                            state: { reseller: r },
                          })
                        }
                      >
                        <Pencil size={14} /> Uppdatera
                      </button>

                      {/* RADERA */}
                      <button
                        className="bg-[#E35C67] hover:bg-[#C94F59] text-white px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1"
                        onClick={() => handleDeleteClick(r)}
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
      {showModal && selectedReseller && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Bekräfta borttagning
            </h3>

            <p className="text-gray-700 mb-6">
              Är du säker på att du vill radera återförsäljaren
              <span className="font-mono font-semibold text-[#E35C6D]"> {selectedReseller.name}</span>? <br /><b>OBS!</b> Denna åtgärd kommer att <b>permanent radera</b> återförsäljaren <b>från alla kontrakt </b> och går <b>inte</b> att ångra.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
              >
                Avbryt
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition"
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
