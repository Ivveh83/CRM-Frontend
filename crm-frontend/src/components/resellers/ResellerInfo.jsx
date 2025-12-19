import React, { act, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resellerService } from "../../services/resellerService";

const ResellerInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reseller, setReseller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔵 Hämta återförsäljare från API
  useEffect(() => {
    const fetchReseller = async () => {
      try {
        const data = await resellerService.getResellerById(id);

        // Map backend camelCase → frontend camelCase
        setReseller({
          id: data.id,
          name: data.name,
          orgNo: data.orgNo,
          address: data.address,
          contactEmail: data.contactEmail,
          contactTelephone: data.contactTelephone,
          invoiceReference: data.invoiceReference,
          createdAt: data.createdAt,
          active: data.active,
        });

      } catch (err) {
        console.error("Fel vid hämtning av återförsäljare:", err);
        setError("Kunde inte hitta återförsäljaren.");
      } finally {
        setLoading(false);
      }
    };

    fetchReseller();
  }, [id]);

  // 🔴 Om vi laddar
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-600 text-lg">Laddar återförsäljare…</p>
      </div>
    );
  }

  // 🔴 Om fel uppstod eller ingen reseller
  if (error || !reseller) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-[#E35C6D]">
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
        <InfoItem label="Organisationsnummer" value={reseller.orgNo} />
        <InfoItem label="Adress" value={reseller.address} />
        <InfoItem label="Kontakt-e-post" value={reseller.contactEmail} />
        <InfoItem label="Telefonnummer" value={reseller.contactTelephone} />
        <InfoItem
          label="Fakturareferens"
          value={reseller.invoiceReference || "Ej angiven"}
        />
        <InfoItem
          label="Skapad"
          value={new Date(reseller.createdAt).toLocaleDateString("sv-SE")}
        />
        <InfoItem
          label="Status"
          value={
            reseller.active ? "Aktiv" : "Inaktiv"
          }
        />
        <InfoItem label="Återförsäljar-ID" value={id} />
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

// 🔹 Återanvändbar komponent
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 break-words">{value || "—"}</p>
  </div>
);

export default ResellerInfo;
