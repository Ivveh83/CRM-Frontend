import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { resellerService } from "../../services/resellerService";

const eventColors = {
  SKAPAT: "bg-emerald-100 text-emerald-800",
  UPPDATERAT: "bg-blue-100 text-blue-800",
  SUPPORT_ANTECKNING: "bg-purple-100 text-purple-800",
  PAUSAT: "bg-yellow-100 text-yellow-800",
  ÅTERAKTIVERAT: "bg-green-100 text-green-800",
  RADERAT: "bg-red-100 text-red-800",
};

export default function ResellerHistory() {
  const { id } = useParams();
  const location = useLocation();

  const resellerId = id || location.state?.resellerId;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await resellerService.getResellerEvents(resellerId);
        setEvents(
          data.sort((a, b) => new Date(b.eventTs) - new Date(a.eventTs))
        );
      } catch (err) {
        console.error("Failed to fetch reseller events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [resellerId]);

  if (loading) {
    return <div className="p-6 text-gray-700">Laddar historik…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Händelsehistorik för återförsäljare: {resellerId}
      </h2>

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
                      eventColors[evt.eventType] || "bg-gray-100 text-gray-800"
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

                <div className="text-right text-sm text-gray-500 min-w-[110px]">
                  {new Date(evt.eventTs).toLocaleString("sv-SE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
