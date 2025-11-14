import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// 🔹 Mockad lista med återförsäljare (ersätt med API-anrop senare)
const mockResellers = [
  {
    id: "reseller-x",
    name: "Företag AB",
    org_no: "556677-8899",
    address: "Storgatan 12, 123 45 Stockholm",
    contact_email: "kontakt@foretag.se",
    contact_telephone: "+46 70 123 45 67",
    invoice_reference: "Kundnr 2025-01",
    created_at: "2024-11-10",
  },
  {
    id: "reseller-y",
    name: "TechPartner Nordic AB",
    org_no: "556788-9911",
    address: "Industrivägen 45, 411 21 Göteborg",
    contact_email: "info@techpartner.se",
    contact_telephone: "+46 73 987 65 43",
    invoice_reference: "TP-INV-0042",
    created_at: "2024-08-05",
  },
];

const ResellerInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hitta återförsäljare baserat på id (mock just nu)
  const reseller = mockResellers.find((r) => r.id === id);

  if (!reseller) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-[#E35C67]">
          Ingen återförsäljare hittades
        </h2>
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
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Återförsäljarinformation
      </h2>

      {/* Företagsinfo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoItem label="Företagsnamn" value={reseller.name} />
        <InfoItem label="Organisationsnummer" value={reseller.org_no} />
        <InfoItem label="Adress" value={reseller.address} />
        <InfoItem label="Kontakt-e-post" value={reseller.contact_email} />
        <InfoItem label="Telefonnummer" value={reseller.contact_telephone} />
        <InfoItem
          label="Fakturareferens"
          value={reseller.invoice_reference || "Ej angiven"}
        />
        <InfoItem
          label="Skapad"
          value={new Date(reseller.created_at).toLocaleDateString("sv-SE")}
        />
      </div>

      {/* Åtgärder */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← Tillbaka
        </button>
        <button
          onClick={() => navigate(`/resellers/update/${reseller.id}`)}
          className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a] transition"
        >
          Uppdatera återförsäljare
        </button>
      </div>
    </div>
  );
};

// 🔹 Återanvändbar komponent för informationsrader
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 break-words">{value || "—"}</p>
  </div>
);

export default ResellerInfo;
