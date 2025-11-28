import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { contractService } from "../../services/contractService";

export default function ContractsDashboard() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 🔵 HÄMTA KONTRAKT
  useEffect(() => {
    const load = async () => {
      try {
        const data = await contractService.getAllContracts();
        setContracts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Kunde inte hämta kontrakt:", err);
        setError(true);
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // === ALLA HOOKS UNDER VARANDRA ===

  const totalContracts = contracts.length;

  const activeContracts = contracts.filter((c) => c.active).length;
  const pausedContracts = contracts.filter((c) => !c.active).length;

  const openContracts = contracts.filter((c) => c.status).length;
  const closedContracts = contracts.filter((c) => !c.status).length;

  const pausedAndOpen = contracts.filter((c) => !c.active && c.status).length;
  const pausedAndClosed = contracts.filter(
    (c) => !c.active && !c.status
  ).length;

  const statusData = [
    { name: "Aktiva", value: activeContracts },
    { name: "Pausade", value: pausedContracts },
  ];

  const openClosedData = [
    { name: "Öppna", value: openContracts },
    { name: "Stängda", value: closedContracts },
  ];

  const STATUS_COLORS = ["#165C6D", "#E8C555"];
  const OPEN_CLOSED_COLORS = ["#E35C67", "#165C6D"];

  const groupObjects = (list, getName) => {
    const grouped = {};
    list.forEach((obj) => {
      const name = getName(obj);
      grouped[name] = (grouped[name] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, antal]) => ({ name, antal }));
  };

  // === GROUPINGS ===
  const bySubscription = useMemo(() => {
    const all = contracts.flatMap((c) => c.subscriptionTypes || []);
    return groupObjects(all, (s) => s.name);
  }, [contracts]);

  const byReseller = useMemo(() => {
    const all = contracts.flatMap((c) => c.resellers || []);
    return groupObjects(all, (r) => r.name);
  }, [contracts]);

  const byCustomer = useMemo(() => {
    const all = contracts.map((c) => c.customer).filter(Boolean);
    return groupObjects(all, (c) => c.companyName);
  }, [contracts]);

  const pausedBySubscription = useMemo(() => {
    const all = contracts
      .filter((c) => !c.active)
      .flatMap((c) => c.subscriptionTypes || []);
    return groupObjects(all, (s) => s.name);
  }, [contracts]);

  const pausedByReseller = useMemo(() => {
    const all = contracts
      .filter((c) => !c.active)
      .flatMap((c) => c.resellers || []);
    return groupObjects(all, (r) => r.name);
  }, [contracts]);

  const pausedByCustomer = useMemo(() => {
    const all = contracts.filter((c) => !c.active).map((c) => c.customer);
    return groupObjects(all.filter(Boolean), (c) => c.companyName);
  }, [contracts]);

  const plural = (antal, singular, plural) => (antal === 1 ? singular : plural);

  // === JSX BÖRJAR EFTER ALLA HOOKS ===
  return (
    <main className="flex justify-center items-start ml-44 bg-gray-50">
      <div className="max-w-screen-xl w-full px-4 py-6 space-y-4">

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center text-gray-600 py-20">
            Laddar kontrakt…
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="text-center text-red-600 py-20">
            Kunde inte ladda kontrakt. Försök igen senare.
          </div>
        )}

        {/* ONLY RENDER IF NOT ERROR AND NOT LOADING */}
        {!loading && !error && (
          <div className="p-6 space-y-6">

            <h1 className="text-2xl font-bold text-[#165C6D]">
              Kontraktsöversikt
            </h1>

            {/* STATISTIK */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              <StatCard
                title="Totalt antal kontrakt"
                value={totalContracts}
                color="#165C6D"
              />

              <StatCard
                title="Öppna för förnyelse"
                value={openContracts}
                color="#E35C67"
              />

              <StatCard
                title="Pausade kontrakt"
                value={pausedContracts}
                subtitle={`${pausedAndOpen} ${plural(
                  pausedAndOpen,
                  "öppet",
                  "öppna"
                )} • ${pausedAndClosed} ${plural(
                  pausedAndClosed,
                  "stängt",
                  "stängda"
                )}`}
                color="gold"
              />
            </div>

            {/* PIE CHARTS */}
            <div className="grid md:grid-cols-2 gap-6">
              <PieCard
                title="Aktiva-/pausade kontrakt"
                data={statusData}
                colors={STATUS_COLORS}
              />

              <PieCard
                title="Öppna-/stängda för förnyelse"
                data={openClosedData}
                colors={OPEN_CLOSED_COLORS}
              />
            </div>

            {/* BAR CHARTS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ChartCard
                title="Antal kontrakt per abonnemang"
                data={bySubscription}
                color="#165C6D"
              />
              <ChartCard
                title="Antal kontrakt per återförsäljare"
                data={byReseller}
                color="#E35C67"
              />
              <ChartCard
                title="Antal kontrakt per kund"
                data={byCustomer}
                color="#1F9E8C"
              />
            </div>

            {/* PAUSADE */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <ChartCard
                title="Pausade per abonnemang"
                data={pausedBySubscription}
                color="#F2C94C"
              />
              <ChartCard
                title="Pausade per återförsäljare"
                data={pausedByReseller}
                color="#E8D27B"
              />
              <ChartCard
                title="Pausade per kund"
                data={pausedByCustomer}
                color="#F2DD72"
              />
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

// COMPONENTER
function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold" style={{ color }}>
        {value}
      </h2>
      {subtitle && <p className="mt-2 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

function PieCard({ title, data, colors }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 text-sm text-gray-600 mt-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            ></span>
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, data, color }) {
  return (
    <div className="bg-white p-4 shadow rounded-2xl">
      <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={false} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="antal" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
