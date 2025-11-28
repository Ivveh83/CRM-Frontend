import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";

const CustomerInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔵 HÄMTA KUND FRÅN API
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id);
        setCustomer(data);
      } catch (err) {
        console.error("Kunde inte hämta kund:", err);
        setError("Kunden kunde inte hittas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // 🟡 LADDAR
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-600 text-lg">Laddar kundinformation...</p>
      </div>
    );
  }

  // 🔴 ERROR ELLER INGEN KUND HITTADES
  if (error || !customer) {
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
        <InfoItem label="Företagsnamn" value={customer.companyName} />
        <InfoItem label="Organisationsnummer" value={customer.orgNo} />
        <InfoItem label="Kontaktperson" value={customer.contactName} />
        <InfoItem label="Kontakt-e-post" value={customer.contactEmail} />
        <InfoItem label="Telefonnummer" value={customer.contactPhone} />
        <InfoItem
          label="Adress"
          value={`${customer.address || ""}, ${customer.city || ""}`}
        />
        <InfoItem label="Postnummer" value={customer.zipCode} />
        <InfoItem label="Land" value={customer.country} />
        <InfoItem label="Bransch" value={customer.industry || "—"} />
        <InfoItem
          label="Kundtyp"
          value={
            customer.customerType === "business"
              ? "Företagskund"
              : customer.customerType === "private"
              ? "Privatkund"
              : "Partner"
          }
        />
        <InfoItem
          label="Skapad"
          value={new Date(customer.createdAt).toLocaleDateString("sv-SE")}
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

// 🔹 Liten återanvändbar komponent
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "—"}</p>
  </div>
);

export default CustomerInfo;
