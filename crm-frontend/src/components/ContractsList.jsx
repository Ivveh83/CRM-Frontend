import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function ContractsList() {
  const mockContracts = [
    {
      id: 1,
      customer: "Kund A",
      reseller: "Reseller X",
      subscriptionType: "Premium",
      status: false, // Mer än 3 månader kvar (2026-04-21)
      contractDate: "2023-04-21",
      subscriptionLength: "12 månader",
      renewalDate: "2024-04-21",
      dueDate: "2026-04-21",
      comment: "Krånglig kund",
    },
    {
      id: 2,
      customer: "Kund B",
      reseller: "Reseller X",
      subscriptionType: "Standard",
      status: true, // Ej förnyad (förfallen, 2024-10-21)
      contractDate: "2024-04-21",
      subscriptionLength: "6 månader",
      renewalDate: "2024-04-21",
      dueDate: "2024-10-21",
      comment: "Inga problem vid senaste förnyelse",
    },
    {
      id: 3,
      customer: "Kund C",
      reseller: "Reseller Y",
      subscriptionType: "Premium",
      status: true, // Ej förnyad (förfallen, 2025-10-21)
      contractDate: "2023-10-21",
      subscriptionLength: "24 månader",
      renewalDate: "2025-01-15",
      dueDate: "2025-10-21",
      comment: "Tar lång tid att förnya",
    },
    {
      id: 4,
      customer: "Kund D",
      reseller: "Reseller Z",
      subscriptionType: "Standard",
      status: true, // 1 månad kvar (2025-11-21)
      contractDate: "2023-11-21",
      subscriptionLength: "12 månader",
      renewalDate: "2024-11-21",
      dueDate: "2025-11-21",
      comment: "Stabil kund",
    },
    {
      id: 5,
      customer: "Kund E",
      reseller: "Reseller Y",
      subscriptionType: "Premium",
      status: true, // Ej förnyad (förfallen, 2025-10-21)
      contractDate: "2024-04-21",
      subscriptionLength: "18 månader",
      renewalDate: "2024-04-21",
      dueDate: "2025-10-21",
      comment: "Nytt avtal förhandlas",
    },
    {
      id: 6,
      customer: "Kund A",
      reseller: "Reseller Z",
      subscriptionType: "Standard",
      status: true, // 3 månader kvar (2026-01-21)
      contractDate: "2024-01-21",
      subscriptionLength: "12 månader",
      renewalDate: "2025-01-21",
      dueDate: "2026-01-21",
      comment: "Förnyelse bekräftad",
    },
    {
      id: 7,
      customer: "Kund B",
      reseller: "Reseller X",
      subscriptionType: "Premium",
      status: true, // 1 månad kvar (2025-11-21)
      contractDate: "2023-11-21",
      subscriptionLength: "24 månader",
      renewalDate: "2024-11-21",
      dueDate: "2025-11-21",
      comment: "Alltid snabb respons",
    },
    {
      id: 8,
      customer: "Kund D",
      reseller: "Reseller Y",
      subscriptionType: "Standard",
      status: true, // Ej förnyad (förfallen, 2025-08-21)
      contractDate: "2023-08-21",
      subscriptionLength: "12 månader",
      renewalDate: "2024-08-21",
      dueDate: "2025-08-21",
      comment: "Behöver uppföljning",
    },
    {
      id: 9,
      customer: "Kund A",
      reseller: "Reseller Z",
      subscriptionType: "Standard",
      status: false, // Mer än 3 månader kvar (2026-05-21)
      contractDate: "2023-05-21",
      subscriptionLength: "12 månader",
      renewalDate: "2024-05-21",
      dueDate: "2026-05-21",
      comment: "Allt fungerar bra",
    },
    {
      id: 10,
      customer: "Kund A",
      reseller: "Reseller X",
      subscriptionType: "Standard",
      status: true, // 2 månader kvar (2025-12-21)
      contractDate: "2024-07-21",
      subscriptionLength: "6 månader",
      renewalDate: "2024-07-21",
      dueDate: "2025-12-21",
      comment: "Tar lång tid att förnya",
    },
];

  // Hjälpfunktion: räkna månader kvar till förfall (dueDate)
  const monthsUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const months =
      (due.getFullYear() - now.getFullYear()) * 12 +
      (due.getMonth() - now.getMonth());
    return months < 0 ? 0 : months;
  };

// Kombinerad färg + form för "Tid kvar"
const getStyleClass = (monthsLeft) => {
  if (monthsLeft <= 1)
    return "bg-red-500 text-white rounded-none border border-red-700"; // 🔴 Kritisk
  if (monthsLeft === 2)
    return "bg-orange-500 text-white rounded-tr-3xl rounded-bl-3xl";   // 🟠 Varning
  if (monthsLeft === 3)
    return "bg-blue-600 text-white rounded-br-3xl shadow-sm";          // 🔵 Aktiv men snart slut
  return "bg-gray-200 text-gray-800 rounded-tl-3xl border border-gray-400"; // ⚪ Trygg, lång tid kvar
};



  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Kontraktslista</h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#165C6D] text-white text-left">
              <th className="py-3 px-4">Kund</th>
              <th className="py-3 px-4">Återförsäljare</th>
              <th className="py-3 px-4">Abonnemang</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tid kvar</th>
              <th className="py-3 px-4">Kontraktsdatum</th>
              <th className="py-3 px-4">Förnyad</th>
              <th className="py-3 px-4">Förfaller</th>
              <th className="py-3 px-4">Längd (månader)</th>
              <th className="py-3 px-4">Kommentar</th>
            </tr>
          </thead>

          <tbody>
            {mockContracts.map((contract, index) => {
              const monthsLeft = monthsUntilDue(contract.dueDate);
              return (
                <tr
                  key={contract.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{contract.customer}</td>
                  <td className="py-3 px-4">{contract.reseller}</td>
                  <td className="py-3 px-4">{contract.subscriptionType}</td>
                  <td className="py-3 px-4">
                    {contract.status ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle size={16} className="mr-1" /> Öppen
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-medium">
                        <XCircle size={16} className="mr-1" /> Stängd
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStyleClass(
                        monthsLeft
                      )}`}
                    >
                      {monthsLeft} mån
                    </span>
                  </td>
                  <td className="py-3 px-4">{contract.contractDate}</td>
                  <td className="py-3 px-4">{contract.renewalDate}</td>
                  <td className="py-3 px-4">{contract.dueDate}</td>
                  <td className="py-3 px-4">{contract.subscriptionLength}</td>
                  <td className="py-3 px-4 italic text-gray-600">{contract.comment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
