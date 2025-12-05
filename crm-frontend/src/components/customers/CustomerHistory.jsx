import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { customerService } from "../../services/customerService";

const eventColors = {
  SKAPAD: "bg-emerald-100 text-emerald-800",
  UPPDATERAD: "bg-blue-100 text-blue-800",
  SUPPORT_ANTECKNING: "bg-purple-100 text-purple-800",
  RADERAD: "bg-red-100 text-red-800",
};

export default function CustomerHistory() {
  const { id } = useParams();
  const location = useLocation();

  const customerId = id || location.state?.customerId;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteAllMode, setDeleteAllMode] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await customerService.getCustomerEvents(customerId);
        setEvents(
          data.sort((a, b) => new Date(b.eventTs) - new Date(a.eventTs))
        );
      } catch (err) {
        console.error("Failed to fetch customer events", err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchEvents();
    }
  }, [customerId]);

  // -------------------------------
  // DELETE SINGLE EVENT
  // -------------------------------
  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setDeleteAllMode(false);
    setShowModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await customerService.deleteCustomerEvent(selectedEvent.id);

      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setShowModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Kunde inte radera händelsen.");
    }
  };

  // -------------------------------
  // DELETE ALL EVENTS
  // -------------------------------
  const handleDeleteAll = () => {
    setDeleteAllMode(true);
    setShowModal(true);
  };

  const confirmDeleteAll = async () => {
    try {
      await customerService.deleteAllCustomerEvents(customerId);

      setEvents([]);
      setShowModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Failed to delete all events", err);
      alert("Kunde inte radera alla händelser.");
    }
  };

  if (!customerId) {
    return (
      <div className="p-6 text-gray-700">
        Inget kund-ID hittades i URL eller state.
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-gray-700">Laddar historik…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#165C6D]">
          Händelsehistorik för kund-ID: {customerId}
        </h2>

        {/* DELETE ALL BUTTON */}
        {events.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-[#E35C67] hover:bg-[#C94F59] text-white rounded-lg text-sm font-semibold shadow"
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
                <div>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      eventColors[evt.eventType] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {evt.eventType}
                  </span>

                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {evt.detail}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Utfört av:{" "}
                    <span className="font-medium">{evt.actor}</span>
                  </p>
                </div>

                {/* RIGHT SIDE: timestamp + delete button */}
                <div className="flex flex-col items-end min-w-[110px]">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(evt.eventTs).toLocaleString("sv-SE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(evt)}
                    className="px-3 py-1 bg-[#E35C67] hover:bg-[#C94F59] text-white text-xs rounded-md shadow"
                  >
                    Radera
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ------------------------------- */}
      {/* MODAL */}
      {/* ------------------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">

            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              {deleteAllMode ? "Radera ALLA händelser?" : "Radera händelse?"}
            </h3>

            <p className="text-gray-700 mb-6">
              {deleteAllMode ? (
                <>
                  Detta kommer att radera <b>alla historikhändelser</b> för kunden.
                  <br />
                  <br />
                  <b>Åtgärden går inte att ångra.</b>
                </>
              ) : (
                <>
                  Vill du radera denna händelse?
                  <br />
                  <br />
                  <b>Åtgärden går inte att ångra.</b>
                </>
              )}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
              >
                Avbryt
              </button>

              <button
                onClick={deleteAllMode ? confirmDeleteAll : confirmDeleteEvent}
                className="px-5 py-2 bg-[#E35C67] hover:bg-[#C94F59] text-white rounded-md"
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
