import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ContractsDashboard() {
  // Exempeldata
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

  // Statistik
  const totalContracts = mockContracts.length;
  const openForRenewal = mockContracts.filter((c) => c.status).length;

  // Grupp-funktion
  const groupBy = (key) => {
    const grouped = mockContracts.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  };

  const bySubscription = useMemo(() => groupBy("subscriptionType"), []);
  const byReseller = useMemo(() => groupBy("reseller"), []);
  const byCustomer = useMemo(() => groupBy("customer"), []);

  // För statusfördelning (PieChart)
  const statusData = [
    { name: "Öppen för förnyelse", value: openForRenewal },
    { name: "Stängd för förnyelse", value: totalContracts - openForRenewal },
  ];

  const COLORS = ["#E35C67", "#165C6D"];

  return (
    <main className="flex justify-center items-start ml-44 bg-gray-50 shadow-lg">

  <div className="max-w-6xl w-full p-6 space-y-6">
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Kontraktsdashboard</h1>

      {/* Statistikrutor */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <p className="text-gray-500 text-sm">Totalt antal kontrakt</p>
          <h2 className="text-3xl font-bold text-[#165C6D]">{totalContracts}</h2>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <p className="text-gray-500 text-sm">Öppna för förnyelse</p>
          <h2 className="text-3xl font-bold text-[#E35C67]">{openForRenewal}</h2>
        </div>

        {/* Cirkeldiagram för status */}
        <div className="bg-white shadow rounded-2xl p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Statusfördelning</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#E35C67] rounded-full"></span>
              Öppen
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#165C6D] rounded-full"></span>
              Stängd
            </div>
          </div>
        </div>
      </div>

      {/* Diagramsektion */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-2xl">
          <h3 className="font-semibold mb-3 text-gray-700">Per abonnemang</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bySubscription}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#165C6D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded-2xl">
          <h3 className="font-semibold mb-3 text-gray-700">Per återförsäljare</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byReseller}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#E35C67" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded-2xl">
          <h3 className="font-semibold mb-3 text-gray-700">Per kund</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCustomer}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1F9E8C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </div>
    </main>
  );
}
