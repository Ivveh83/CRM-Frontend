import React from "react";

// Exempeldata
const mockSubscriptions = [
  {
    id: "sub-1",
    name: "Threat Monitoring Basic",
    category: "Threat Monitoring",
    description: "Övervakar nätverkstrafik och loggar för misstänkt aktivitet.",
    service_level: "Silver (12/5)",
    price_per_month: 2999,
    contract_length: 12,
    renewal_period: 12,
    active: true,
    support_contact: "support@foretag.se",
    created_at: "2025-01-10",
  },
  {
    id: "sub-2",
    name: "SOC-as-a-Service Advanced",
    category: "SOC-as-a-Service",
    description: "Fullt hanterad SOC-lösning med realtidsincidentrespons.",
    service_level: "Gold (24/7)",
    price_per_month: 9999,
    contract_length: 24,
    renewal_period: 12,
    active: true,
    support_contact: "soc@foretag.se",
    created_at: "2024-11-05",
  },
  {
    id: "sub-3",
    name: "Penetration Testing On-Demand",
    category: "Penetration Testing",
    description: "Sårbarhetsanalys och penetrationstest vid behov.",
    service_level: "Bronze (kontorstid)",
    price_per_month: 4999,
    contract_length: 6,
    renewal_period: 6,
    active: false,
    support_contact: "security@foretag.se",
    created_at: "2024-07-18",
  },
  {
    id: "sub-4",
    name: "Endpoint Protection Suite",
    category: "Endpoint Protection",
    description: "Skydd mot skadlig kod och intrångsförsök på alla enheter.",
    service_level: "Platinum (dedikerad SOC)",
    price_per_month: 11999,
    contract_length: 36,
    renewal_period: 12,
    active: true,
    support_contact: "endpoint@foretag.se",
    created_at: "2024-02-01",
  },
];

const SubscriptionsList = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">Abonnemangslista</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#165C6D] text-white text-left">
              <th className="px-4 py-3 rounded-tl-lg">Namn</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Service-nivå</th>
              <th className="px-4 py-3">Pris (SEK/mån)</th>
              <th className="px-4 py-3">Kontraktslängd</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Support</th>
              <th className="px-4 py-3 rounded-tr-lg">Skapad</th>
            </tr>
          </thead>

          <tbody>
            {mockSubscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                {/* Namn + beskrivning */}
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{sub.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {sub.description}
                  </div>
                </td>

                {/* Kategori */}
                <td className="px-4 py-3 text-gray-700">{sub.category}</td>

                {/* Service Level Badge */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      sub.service_level.includes("Platinum")
                        ? "bg-yellow-100 text-yellow-800"
                        : sub.service_level.includes("Gold")
                        ? "bg-orange-100 text-orange-800"
                        : sub.service_level.includes("Silver")
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {sub.service_level}
                  </span>
                </td>

                {/* Pris */}
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {sub.price_per_month.toLocaleString()} kr
                </td>

                {/* Kontraktslängd */}
                <td className="px-4 py-3 text-gray-700">
                  {sub.contract_length} mån
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sub.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {sub.active ? "Aktivt" : "Inaktivt"}
                  </span>
                </td>

                {/* Supportkontakt */}
                <td className="px-4 py-3 text-gray-700 text-sm">
                  {sub.support_contact}
                </td>

                {/* Skapad */}
                <td className="px-4 py-3 text-gray-500 text-sm">
                  {new Date(sub.created_at).toLocaleDateString("sv-SE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionsList;
