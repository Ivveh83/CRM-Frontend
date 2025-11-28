import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscriptionService } from "../../services/subscriptionService";

const SubscriptionInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔵 HÄMTA ABONNEMANG FRÅN API
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await subscriptionService.getSubscriptionById(id);
        setSub(data);
      } catch (err) {
        console.error("Kunde inte hämta abonnemang:", err);
        setError("Abonnemanget kunde inte hittas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  // 🟡 LADDAR
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-600 text-lg">Laddar abonnemang...</p>
      </div>
    );
  }

  // 🔴 ERROR / INTE FUNNET
  if (error || !sub) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-[#E35C67]">Inget abonnemang hittades</h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-[#165C6D] text-white rounded-lg hover:bg-[#1f7585] transition"
        >
          Tillbaka
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">Abonnemangsinfo</h2>

      {/* Grid med abonnemangsdata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoItem label="Namn" value={sub.name} />
        <InfoItem label="Kategori" value={sub.category} />
        <InfoItem label="Service Level" value={sub.serviceLevel} />

        <InfoItem
          label="Pris per månad"
          value={sub.pricePerMonth ? `${sub.pricePerMonth} kr` : "—"}
        />

        <InfoItem
          label="Kontraktslängd"
          value={sub.contractLength ? `${sub.contractLength} månader` : "—"}
        />

        <InfoItem
          label="Förnyelseperiod"
          value={sub.renewalPeriod ? `${sub.renewalPeriod} månader` : "—"}
        />

        <InfoItem
          label="Status"
          value={sub.active ? "Aktivt" : "Inaktivt"}
        />

        <InfoItem label="Supportkontakt" value={sub.supportContact} />

        <InfoItem
          label="Skapad"
          value={
            sub.createdAt
              ? new Date(sub.createdAt).toLocaleDateString("sv-SE")
              : "—"
          }
        />
      </div>

      {/* Beskrivning */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-700 mb-2">Beskrivning</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {sub.description || "Ingen beskrivning tillagd."}
        </p>
      </div>

      {/* Anteckningar */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-700 mb-2">Anteckningar</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {sub.notes || "Inga anteckningar tillagda."}
        </p>
      </div>

      {/* Knappsektion */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← Tillbaka
        </button>

        <button
          onClick={() => navigate(`/subscriptions/update/${sub.id}`, { state: { subscription: sub } })}
          className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a] transition"
        >
          Uppdatera abonnemang
        </button>
      </div>
    </div>
  );
};

// 🔹 Återanvändbar liten komponent för rader
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "—"}</p>
  </div>
);

export default SubscriptionInfo;
