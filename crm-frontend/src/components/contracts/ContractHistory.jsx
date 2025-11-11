import React from "react";

// Mockad eventhistorik (tabell subscription_event)
const mockEvents = [
  {
    id: "evt-001",
    contract_id: "sub-1",
    event_type: "SKAPAT",
    event_ts: "2024-11-15T10:22:00Z",
    detail: "Kontraktet skapades av säljare.",
    actor: "Admin Företag AB",
  },
  {
    id: "evt-002",
    contract_id: "sub-1",
    event_type: "UPPDATERAT",
    event_ts: "2025-02-10T09:30:00Z",
    detail: "Pris per månad ändrades från 2999 till 3499 SEK.",
    actor: "Anna Karlsson",
  },
  {
    id: "evt-003",
    contract_id: "sub-1",
    event_type: "FÖRNYAT",
    event_ts: "2025-03-01T08:00:00Z",
    detail: "Kontraktet förnyades automatiskt för 12 månader.",
    actor: "System",
  },
  {
    id: "evt-004",
    contract_id: "sub-1",
    event_type: "SUPPORT_ANTECKNING",
    event_ts: "2025-04-18T14:45:00Z",
    detail: "Kund kontaktade support om fakturering. Ärendet löst.",
    actor: "Support Företag AB",
  },
  {
    id: "evt-005",
    contract_id: "sub-1",
    event_type: "AVBRUTET",
    event_ts: "2025-05-05T11:10:00Z",
    detail: "Tjänsten pausades tillfälligt p.g.a. utebliven betalning.",
    actor: "Ekonomi Företag AB",
  },
  {
    id: "evt-006",
    contract_id: "sub-1",
    event_type: "ÅTERAKTIVERAT",
    event_ts: "2025-05-12T09:15:00Z",
    detail: "Tjänsten återaktiverades efter betalning.",
    actor: "System",
  },
];

const eventColors = {
  SKAPAT: "bg-green-100 text-green-800",
  UPPDATERAT: "bg-blue-100 text-blue-800",
  FÖRNYAT: "bg-yellow-100 text-yellow-800",
  SUPPORT_ANTECKNING: "bg-purple-100 text-purple-800",
  AVBRUTET: "bg-red-100 text-red-700",
  ÅTERAKTIVERAT: "bg-emerald-100 text-emerald-700",
};

const ContractsHistory = ({ contractId = "sub-1" }) => {
  // Filtrera händelser för ett visst abonnemang (om du vill)
  const events = mockEvents
    .filter((evt) => evt.contract_id === contractId)
    .sort((a, b) => new Date(b.event_ts) - new Date(a.event_ts));

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Händelsehistorik för {contractId}
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">Inga händelser registrerade ännu.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {events.map((evt, index) => (
            <li key={index} className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  {/* Event-type badge */}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${eventColors[evt.event_type]}`}
                  >
                    {evt.event_type}
                  </span>

                  {/* Event detail */}
                  <p className="mt-2 text-gray-700">{evt.detail}</p>

                  {/* Actor */}
                  <p className="text-sm text-gray-500 mt-1">
                    Utfört av: <span className="font-medium">{evt.actor}</span>
                  </p>
                </div>

                {/* Datum */}
                <div className="text-right text-sm text-gray-500">
                  {new Date(evt.event_ts).toLocaleString("sv-SE", {
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
};

export default ContractsHistory;
