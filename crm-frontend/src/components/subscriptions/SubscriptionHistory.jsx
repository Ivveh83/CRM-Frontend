import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { subscriptionService } from "../../services/subscriptionService";

const eventColors = {
  SKAPAT: "bg-emerald-100 text-emerald-800",
  UPPDATERAT: "bg-blue-100 text-blue-800",
  PAUSAT: "bg-yellow-100 text-yellow-800",
  ÅTERAKTIVERAT: "bg-green-100 text-green-800",
  SUPPORT_ANTECKNING: "bg-purple-100 text-purple-800",
  RADERAT: "bg-red-100 text-red-800",
};

export default function SubscriptionHistory() {
  const { id } = useParams();
  const location = useLocation();

  const subscriptionId = id || location.state?.subscriptionId;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal-state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await subscriptionService.getSubscriptionEvents(subscriptionId);
        setEvents(data.sort((a, b) => new Date(b.eventTs) - new Date(a.eventTs)));
      } catch (err) {
        console.error("Failed to fetch subscription events", err);
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) fetchEvents();
  }, [subscriptionId]);

  if (!subscriptionId) {
    return <div className="p-6 text-gray-700">Inget abonnemangs-ID hittades.</div>;
  }

  if (loading) {
    return <div className="p-6 text-gray-700">Laddar historik…</div>;
  }

  // ----------------------------------------
  // 🗑️ DELETE SINGLE EVENT
  // ----------------------------------------
  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    try {
      await subscriptionService.deleteSubscriptionEvent(selectedEvent.id);

      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Kunde inte radera event:", err);
      alert("Misslyckades med att radera event.");
    }
  };

  // ----------------------------------------
  // 🗑️ DELETE ALL EVENTS
  // ----------------------------------------
  const openDeleteAllModal = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = async () => {
    try {
      await subscriptionService.deleteAllSubscriptionEvents(subscriptionId);
      setEvents([]);
      setShowDeleteAllModal(false);
    } catch (err) {
      console.error("Kunde inte radera all historik:", err);
      alert("Misslyckades med att radera all historik.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#165C6D]">
          Händelsehistorik för abonnemang: {subscriptionId}
        </h2>

        {/* DELETE ALL BUTTON */}
        {events.length > 0 && (
          <button
            onClick={openDeleteAllModal}
            className="px-4 py-2 bg-[#E35C67] hover:bg-[#C94F59] text-white rounded-md text-sm font-semibold transition"
          >
            Radera alla händelser
          </button>
        )}
      </div>

      {/* Events list */}
      {events.length === 0 ? (
        <p className="text-gray-500">Inga händelser registrerade ännu.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {events.map((evt) => (
            <li key={evt.id} className="py-4">
              <div className="flex items-start justify-between">

                {/* Left side */}
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

                {/* Right side */}
                <div className="flex flex-col items-end min-w-[140px] text-right">
                  <span className="text-sm text-gray-500">
                    {new Date(evt.eventTs).toLocaleString("sv-SE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>

                  <button
                    onClick={() => openDeleteModal(evt)}
                    className="mt-2 px-3 py-1 bg-[#E35C67] hover:bg-[#C94F59] text-white rounded-md text-xs font-semibold transition"
                  >
                    Radera
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------------------------------- */}
      {/* MODAL: DELETE SINGLE EVENT */}
      {/* ---------------------------------------- */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Radera händelse?
            </h3>

            <p className="text-gray-700 mb-6">
              Är du säker på att du vill radera denna händelse?
              <br /><br />
              <span className="font-mono text-[#E35C67] font-bold">
                {selectedEvent.eventType}
              </span>
              <br /><br />
              Detta går <b>inte</b> att ångra.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                Avbryt
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-[#E35C67] hover:bg-[#C94F59] text-white transition"
              >
                Radera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------- */}
      {/* MODAL: DELETE ALL EVENTS */}
      {/* ---------------------------------------- */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Radera alla händelser?
            </h3>

            <p className="text-gray-700 mb-6">
              Detta kommer att ta bort <b>samtliga händelser</b> för detta abonnemang.
              <br /><br />
              Detta går <b>inte</b> att ångra.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                Avbryt
              </button>

              <button
                onClick={confirmDeleteAll}
                className="px-4 py-2 rounded-md bg-[#E35C67] hover:bg-[#C94F59] text-white transition"
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
