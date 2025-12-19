import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { contractService } from "../../services/contractService";

const ContractInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✨ Om kontrakt skickas via state, använd det direkt
  const passedContract = location.state?.contract;
  console.log("Passed contract via state:", passedContract);

  const [contract, setContract] = useState(passedContract || null);
  const [loading, setLoading] = useState(!passedContract); // Om vi har state → ingen laddning
  const [error, setError] = useState(null);

  // 🔵 HÄMTA KONTRAKT FRÅN API ENDAST OM INGET STATE FINNS
  useEffect(() => {
    if (passedContract) return; // ← hoppa över API-anropet

    const fetchContract = async () => {
      try {
        const data = await contractService.getContractById(id);
        setContract(data);
      } catch (err) {
        console.error("Kunde inte hämta kontrakt:", err);
        setError("Kontraktet kunde inte hittas.");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id, passedContract]);

  // 🟡 LADDAR
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-600 text-lg">Laddar kontraktsinformation...</p>
      </div>
    );
  }

  // 🔴 ERROR ELLER INGET KONTRAKT HITTADEs
  if (error || !contract) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-semibold text-[#E35C67]">
          Inget kontrakt hittades
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
console.log("Subscriptions:", contract.subscriptionTypes);

  // 🧮 FORMATTERA DATA
  const customerName = contract.customer?.companyName || "—";

  const resellers = contract.resellers?.length
    ? contract.resellers.map(r => r.name).join(", ")
    : "—";

  const subscriptions = contract.subscriptionTypes?.length
    ? contract.subscriptionTypes.map(s => s.name).join(", ")
    : "—";
    

  const renewalDates = contract.renewalDates?.length
    ? contract.renewalDates.map(d =>
        new Date(d).toLocaleDateString("sv-SE")
      ).join(", ")
    : "—";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Kontraktsinformation
      </h2>

      {/* Kontraktsinfo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoItem label="Kund" value={customerName} />
        <InfoItem label="Återförsäljare" value={resellers} />
        <InfoItem label="Abonnemang" value={subscriptions} />
        <InfoItem label="Status" value={contract.status ? "Godkänt" : "Ej godkänt"} />
        <InfoItem label="Aktivt" value={contract.active ? "Aktivt" : "Inaktivt"} />
        <InfoItem
          label="Kontraktsdatum"
          value={new Date(contract.contractDate).toLocaleDateString("sv-SE")}
        />
        <InfoItem
          label="Kontraktslängd (månader)"
          value={contract.contractLengthMonths}
        />
        <InfoItem
          label="Totalpris per månad"
          value={`${contract.totalPricePerMonth} kr`}
        />
        <InfoItem
          label="Förfallodatum"
          value={new Date(contract.dueDate).toLocaleDateString("sv-SE")}
        />
        <InfoItem label="Förnyelsedatum" value={renewalDates} />
        <InfoItem label="Kontrakts-ID" value={id} />
      </div>

      {/* Kommentar */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-700 mb-2">Kommentar</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {contract.comment || "Ingen kommentar tillagd."}
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
          onClick={() => navigate(`/contracts/update/${contract.id}`)}
          className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a] transition"
        >
          Uppdatera kontrakt
        </button>
      </div>
    </div>
  );
};

// 🔹 Återanvändbar komponent
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "—"}</p>
  </div>
);

export default ContractInfo;
