import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Exempel på mockad kund (ta bort när du kopplar mot riktig data)
const mockCustomers = [
  {
    id: "kund-a",
    company_name: "Företag AB",
    org_no: "556677-8899",
    contact_name: "Anna Karlsson",
    contact_email: "anna.karlsson@foretag.se",
    contact_phone: "+46 70 123 45 67",
    address: "Storgatan 12",
    city: "Stockholm",
    zip_code: "123 45",
    country: "Sverige",
    industry: "IT",
    customer_type: "business",
    created_at: "2024-05-10",
    notes: "Viktig kund, kontaktas varje kvartal.",
  },
];

const CustomerInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hitta kund baserat på id (mock just nu)
  const customer = mockCustomers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-[#E35C67]">
          Ingen kund hittades
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
        Kundinformation
      </h2>

      {/* Företagsinfo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoItem label="Företagsnamn" value={customer.company_name} />
        <InfoItem label="Organisationsnummer" value={customer.org_no} />
        <InfoItem label="Kontaktperson" value={customer.contact_name} />
        <InfoItem label="Kontakt-e-post" value={customer.contact_email} />
        <InfoItem label="Telefonnummer" value={customer.contact_phone} />
        <InfoItem label="Adress" value={`${customer.address}, ${customer.city}`} />
        <InfoItem label="Postnummer" value={customer.zip_code} />
        <InfoItem label="Land" value={customer.country} />
        <InfoItem label="Bransch" value={customer.industry || "—"} />
        <InfoItem
          label="Kundtyp"
          value={
            customer.customer_type === "business"
              ? "Företagskund"
              : customer.customer_type === "private"
              ? "Privatkund"
              : "Partner"
          }
        />
        <InfoItem
          label="Skapad"
          value={new Date(customer.created_at).toLocaleDateString("sv-SE")}
        />
      </div>

      {/* Anteckningar */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-700 mb-2">Anteckningar</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {customer.notes || "Inga anteckningar tillagda."}
        </p>
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
          onClick={() => navigate(`/customers/update/${customer.id}`)}
          className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a] transition"
        >
          Uppdatera kund
        </button>
      </div>
    </div>
  );
};

// 🔹 Liten hjälpfunktion för återanvändbara rader
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "—"}</p>
  </div>
);

export default CustomerInfo;
