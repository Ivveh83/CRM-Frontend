import React from "react";
import { Link } from "react-router-dom";

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
  const handleUpdate = (sub) => {
    alert(`🛠️ Uppdatera abonnemang: ${sub.name}`);
  };

  const handleDelete = (sub) => {
    const confirmed = window.confirm(
      `⚠️ Är du säker på att du vill radera abonnemanget "${sub.name}"?\nDenna åtgärd kan inte ångras.`
    );
    if (confirmed) {
      alert(`❌ Abonnemang "${sub.name}" har raderats.`);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-screen-xl bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
          Abonnemangslista
        </h2>

        {/* Tabellen anpassas utan att klippas */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-[#165C6D] text-white text-left">
                <th className="px-4 py-3 rounded-tl-lg">Namn</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Service-nivå</th>
                <th className="px-4 py-3">Pris (SEK/mån)</th>
                <th className="px-4 py-3">Kontraktslängd</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Support</th>
                <th className="px-4 py-3">Skapad</th>
                <th className="px-4 py-3 text-right rounded-tr-lg w-[160px]">
                  Åtgärder
                </th>
              </tr>
            </thead>

            <tbody>
              {mockSubscriptions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {/* Namn & beskrivning */}
                  <td className="px-4 py-3">
                      <div className="font-semibold text-[#165C6D] group-hover:underline">
                        {sub.name}
                      </div>
                      <div className="text-sm text-gray-500 break-words max-w-[200px]">
                        {sub.description}
                      </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{sub.category}</td>

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

                  <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                    {sub.price_per_month.toLocaleString()} kr
                  </td>

                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {sub.contract_length} mån
                  </td>

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

                  <td className="px-4 py-3 text-gray-700 text-sm whitespace-nowrap">
  {sub.support_contact}
</td>


                  <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString("sv-SE")}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleUpdate(sub)}
                      className="px-3 py-1 bg-[#165C6D] text-white text-sm rounded-md hover:bg-[#1f7585] transition mr-2"
                    >
                      Uppdatera
                    </button>
                    <button
                      onClick={() => handleDelete(sub)}
                      className="px-3 py-1 bg-[#E35C67] text-white text-sm rounded-md hover:bg-red-600 transition"
                    >
                      Radera
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsList;
