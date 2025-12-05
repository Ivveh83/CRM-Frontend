import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { contractService } from "../../services/contractService";

// 🎨 Färg-taggar baserat på eventtyp
const eventColors = {
  SKAPAT: "bg-emerald-100 text-emerald-800",
  UPPDATERAT: "bg-blue-100 text-blue-800",
  FÖRNYAT: "bg-lime-100 text-lime-800",
  SUPPORT_ANTECKNING: "bg-purple-100 text-purple-800",
  PAUSAT: "bg-yellow-100 text-yellow-800",
  ÅTERAKTIVERAT: "bg-green-100 text-green-800",
  RADERAT: "bg-red-100 text-red-800",
};

export default function ContractHistory() {
  const { id } = useParams();
  const location = useLocation();

  const contractId = id || location.state?.contractId;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟥 Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // --------------------------------------------------
  // 🔵 Hämta events
  // --------------------------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await contractService.getContractEvents(contractId);
        setEvents(
          data.sort((a, b) => new Date(b.eventTs) - new Date(a.eventTs))
        );
      } catch (err) {
        console.error("Failed to fetch contract events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [contractId]);

  // --------------------------------------------------
  // 🗑️ Delete ett event
  // --------------------------------------------------
  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await contractService.deleteContractEvent(selectedEvent.id);

      // Ta bort ur UI
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));

      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Kunde inte radera event:", err);
      alert("Det gick inte att radera händelsen.");
    }
  };

  // --------------------------------------------------
  // 🗑️ Delete ALL events
  // --------------------------------------------------
  const confirmDeleteAll = async () => {
    try {
      await contractService.deleteAllContractEvents(contractId);

      setEvents([]);
      setShowDeleteAllModal(false);
    } catch (err) {
      console.error("Kunde inte radera alla event:", err);
      alert("Det gick inte att radera alla händelser.");
    }
  };

  // --------------------------------------------------
  // Render UI
  // --------------------------------------------------
  if (loading) {
    return <div className="p-6 text-gray-700">Laddar historik…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#165C6D]">
          Händelsehistorik för kontrakt-ID: {contractId}
        </h2>

        {/* DELETE ALL BUTTON */}
        {events.length > 0 && (
          <button
            onClick={() => setShowDeleteAllModal(true)}
            className="px-4 py-2 bg-[#E35C67] hover:bg-[#C94F59] text-white rounded-md text-sm font-semibold transition"
          >
            Radera alla
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">Inga händelser registrerade ännu.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {events.map((evt) => (
            <li key={evt.id} className="py-4">
              <div className="flex items-start justify-between">
                {/* Vänster kolumn */}
                <div>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      eventColors[evt.eventType] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {evt.eventType}
                  </span>

                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {evt.detail}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Utfört av: <span className="font-medium">{evt.actor}</span>
                  </p>
                </div>

                {/* Höger kolumn */}
                <div className="text-right text-sm text-gray-500 min-w-[140px]">
                  <div>
                    {new Date(evt.eventTs).toLocaleString("sv-SE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      setSelectedEvent(evt);
                      setShowDeleteModal(true);
                    }}
                    className="mt-3 px-3 py-1 bg-[#E35C67] hover:bg-[#C94F59] text-white rounded-md text-xs font-semibold"
                  >
                    Radera
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --------------------------------------------------
          DELETE ONE MODAL
      -------------------------------------------------- */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Radera händelse?
            </h3>

            <p className="text-gray-700 mb-6">
              Vill du ta bort denna händelse? <br />
              <b>Det går inte att ångra.</b>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800"
              >
                Avbryt
              </button>

              <button
                onClick={confirmDeleteEvent}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
              >
                Radera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------
          DELETE ALL MODAL
      -------------------------------------------------- */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Radera ALLA händelser?
            </h3>

            <p className="text-gray-700 mb-6">
              Detta kommer ta bort <b>alla händelser</b> kopplade till kontraktet.
              <br />
              <b>Det går inte att ångra.</b>
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800"
              >
                Avbryt
              </button>

              <button
                onClick={confirmDeleteAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
              >
                Radera alla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
