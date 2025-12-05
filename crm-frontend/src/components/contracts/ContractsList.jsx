import React, { useState, useEffect } from "react";
import {
  Eye,
  History,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  RefreshCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { contractService } from "../../services/contractService.js";
import ContractsFilters from "./ContractsFilters.jsx";
import { useContractsFilters } from "./useContractsFilters.js";
import UuidHistorySearch from "../common/UuidHistorySearch.jsx";

export default function ContractsList() {
  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    active: "ALL",
    sortField: "customer",
    sortDirection: "asc",
  });
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const navigate = useNavigate();

  const [showStateModal, setShowStateModal] = useState(false);
  const [stateReason, setStateReason] = useState("");
  const [stateLoading, setStateLoading] = useState(false);
  const [contractToToggle, setContractToToggle] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await contractService.getAllContracts();
        console.log("Fetched contracts:", data);
        setContracts(data);
        setLoading(false);
      } catch (err) {
        setError("Kunde inte ladda kontrakten.");
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const monthsUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const months =
      (due.getFullYear() - now.getFullYear()) * 12 +
      (due.getMonth() - now.getMonth());
    return months < 0 ? 0 : months;
  };

  const displayContracts = useContractsFilters(
    contracts,
    filters,
    monthsUntilDue
  );

  const getStyleClass = (monthsLeft) => {
    if (monthsLeft <= 1)
      return "bg-red-500 text-white rounded-none border border-red-700";
    if (monthsLeft === 2)
      return "bg-orange-500 text-white rounded-tr-3xl rounded-bl-3xl";
    if (monthsLeft === 3)
      return "bg-blue-600 text-white rounded-br-3xl shadow-sm";
    return "bg-gray-200 text-gray-800 rounded-tl-3xl border border-gray-400";
  };

  const handleDeleteClick = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedContract) return;

    try {
      await contractService.deleteContract(selectedContract.id);

      alert(`Kontrakt ${selectedContract.id} har raderats!`);

      setContracts((prev) => prev.filter((c) => c.id !== selectedContract.id));
    } catch (error) {
      console.error("Fel vid radering:", error);
      alert("Kunde inte radera kontraktet.");
    }

    setShowModal(false);
    setSelectedContract(null);
  };

  const toggleActive = (contract) => {
    setContractToToggle(contract);
    setStateReason("");
    setShowStateModal(true);
  };

  const confirmStateChange = async () => {
    if (!contractToToggle) return;

    setStateLoading(true);

    try {
      await contractService.updateContractActive(contractToToggle.id, {
        active: !contractToToggle.active,
        detail: stateReason,
      });

      // Optimistisk uppdatering
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractToToggle.id ? { ...c, active: !c.active } : c
        )
      );

      setShowStateModal(false);
      setContractToToggle(null);
    } catch (error) {
      console.error("Fel vid statusbyte:", error);
      alert("Kunde inte uppdatera kontraktets status.");
    } finally {
      setStateLoading(false);
    }
  };

  const renewContract = async (contract) => {
    const today = new Date();

    // 1. Lägg till dagens datum i ISO-format
    const todayStr = today.toISOString().split("T")[0];

    // 2. Räkna fram nytt förfallodatum
    const newDue = new Date(today);
    newDue.setMonth(newDue.getMonth() + contract.contractLengthMonths);

    const newDueStr = newDue.toISOString().split("T")[0];

    // 3. Räkna ut antal månader mellan idag och nya förfallodatumet
    const monthsLeft =
      (newDue.getFullYear() - today.getFullYear()) * 12 +
      (newDue.getMonth() - today.getMonth());

    // Status ska vara false om > 3 månader kvar
    const newStatus = monthsLeft > 3 ? false : true;

    try {
      await contractService.renewContract(contract.id, {
        dueDate: newDueStr,
        renewalDates: [...contract.renewalDates, todayStr],
        status: newStatus,
      });

      // 4. Optimistisk UI-uppdatering
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contract.id
            ? {
                ...c,
                dueDate: newDueStr,
                renewalDates: [...c.renewalDates, todayStr],
                status: newStatus,
              }
            : c
        )
      );

      alert(`Kontrakt ${contract.id} har förnyats!`);
    } catch (err) {
      console.error("Fel vid förnyelse:", err);
      alert("Kunde inte förnya kontraktet.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#165C6D] ">Kontraktslista</h2>

      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <UuidHistorySearch basePath="contracts" />
          <ContractsFilters filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {loading && <div className="text-gray-700 py-4">Laddar kontrakt...</div>}

      {error && <div className="text-red-600 py-4">{error}</div>}

      {loading || error ? null : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#165C6D] text-white text-left">
                <th className="py-3 px-4">Kund</th>
                <th className="py-3 px-4">Kunds org.nr</th>
                <th className="py-3 px-4">Återförsäljare</th>
                <th className="py-3 px-4">Abonnemang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tid kvar</th>
                <th className="py-3 px-4">Kontraktsdatum</th>
                <th className="py-3 px-4">Förnyelsedatum</th>
                <th className="py-3 px-4">Förfallodatum</th>
                <th className="py-3 px-4">Längd</th>
                <th className="py-3 px-4">Månadspris</th>
                <th className="py-3 px-4">Kommentar</th>
                <th className="py-3 px-4 text-right">Åtgärder</th>
              </tr>
            </thead>

            <tbody>
              {displayContracts?.map((contract, index) => {
                const monthsLeft = monthsUntilDue(contract.dueDate);

                return (
                  <tr
                    key={contract.id}
                    className={`border-b transition ${
                      !contract.active
                        ? "bg-yellow-100 hover:bg-yellow-200"
                        : index % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-[#165C6D] hover:underline">
                      <Link to={`/customers/${contract.customer.id}`}>
                        {contract.customer.companyName}
                      </Link>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {contract.customer.orgNo}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {contract.resellers.map((r) => {
                          return (
                            <Link
                              key={r.name}
                              to={`/resellers/${r.id}`}
                              className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                                r.active
                                  ? "text-blue-700 hover:bg-blue-200"
                                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              {r.name}
                            </Link>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {contract.subscriptionTypes.map((s) => {
                          return (
                            <Link
                              key={s.name}
                              to={`/subscriptions/${s.id}`}
                              className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                                s.active
                                  ? "text-green-700 hover:bg-green-200"
                                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              {s.name}
                            </Link>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {!contract.active ? (
                        <span className="flex items-center text-yellow-700 font-semibold">
                          <PauseCircle size={16} className="mr-1" /> Pausat
                        </span>
                      ) : contract.status ? (
                        <span className="flex items-center text-green-600 font-medium">
                          <CheckCircle size={16} className="mr-1" /> Öppet
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-medium">
                          <XCircle size={16} className="mr-1" /> Stängt
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStyleClass(
                          monthsLeft
                        )}`}
                      >
                        {monthsLeft} mån
                      </span>
                    </td>

                    <td className="py-3 px-4">{contract.contractDate}</td>

                    <td className="py-3 px-4">
                      <ul className="space-y-1">
                        {contract.renewalDates.map((date, i) => (
                          <li key={i} className="text-sm">
                            {date}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="py-3 px-4">{contract.dueDate}</td>

                    <td className="py-3 px-4">
                      {contract.contractLengthMonths}{" "}
                      {contract.contractLengthMonths === 1
                        ? "månad"
                        : "månader"}
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {contract.totalPricePerMonth?.toLocaleString("sv-SE")} kr
                    </td>

                    <td className="py-3 px-4 italic text-gray-600">
                      {contract.comment?.length > 50
                        ? contract.comment.slice(0, 50) + " ...."
                        : contract.comment}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {/* Pausa / Aktivera */}
                        <button
                          className={`px-3 py-1 text-xs font-semibold flex items-center gap-1 transition ${
                            contract.active
                              ? "bg-amber-300 hover:bg-amber-400 text-[#165C6D] rounded-xl"
                              : "bg-[#D48A62] hover:bg-[#BC7754] text-white rounded-full"
                          }`}
                          onClick={() => toggleActive(contract)}
                        >
                          {contract.active ? (
                            <PauseCircle size={14} />
                          ) : (
                            <PlayCircle size={14} />
                          )}
                          {contract.active ? "Pausa" : "Aktivera"}
                        </button>

                        {/* SE INFO */}
                        <button
                          className="bg-[#C9E5D9] hover:bg-[#B5D9CA] text-[#165C6D] px-4 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1"
                          onClick={() =>
                            navigate(`/contracts/${contract.id}`, {
                              state: { contract: contract },
                            })
                          }
                        >
                          <Eye size={14} /> Se info
                        </button>

                        {/* Förnya */}
                        {monthsLeft <= 3 && (
                          <button
                            className="bg-[#1A7286] hover:bg-[#145665] text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                            onClick={() => renewContract(contract)}
                          >
                            <RefreshCcw size={14} />
                            Förnya
                          </button>
                        )}

                        {/* Uppdatera */}
                        <button
                          className="bg-[#6A6FA3] hover:bg-[#565A89] text-white px-3 py-1 rounded-[6px] text-xs font-semibold flex items-center gap-1 transition"
                          onClick={() =>
                            navigate(`/contracts/update/${contract.id}`, {
                              state: { contract },
                            })
                          }
                        >
                          <Pencil size={14} />
                          Uppdatera
                        </button>

                        {/* Historik */}
                        <button
                          className="bg-[#CBD5D8] hover:bg-[#B7C4C8] text-[#165C6D] px-3 py-1 rounded-2xl text-xs font-semibold flex items-center gap-1 transition"
                          onClick={() =>
                            navigate(`/contracts/${contract.id}/history`, {
                              state: { contractId: contract.id },
                            })
                          }
                        >
                          <History size={14} />
                          Historik
                        </button>

                        {/* Radera */}
                        <button
                          className="bg-[#E35C67] hover:bg-[#C94F59] text-white px-3 py-1 rounded-sm text-xs font-semibold flex items-center gap-1 transition"
                          onClick={() => handleDeleteClick(contract)}
                        >
                          <Trash2 size={14} />
                          Radera
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedContract && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Bekräfta borttagning
            </h3>
            <p className="text-gray-700 mb-6">
              Är du säker på att du vill radera kontrakt för{" "}
              <strong>{selectedContract.customer?.companyName}</strong>?
              <br />
              <br /> <b>Åtgärden går inte att ångra.</b>
              <br /> <br />
              Spara detta ID-nr för framtida referens:{" "}
              <span className="font-mono font-semibold text-[#E35C6D]">
                {selectedContract.id}
              </span>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
              >
                Avbryt
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                Radera
              </button>
            </div>
          </div>
        </div>
      )}

      {showStateModal && contractToToggle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              {contractToToggle.active ? "Pausa kontrakt" : "Aktivera kontrakt"}
            </h3>

            <p className="text-gray-700 mb-4 text-sm">
              Ange en anledning som kommer sparas i historiken:
            </p>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              rows="3"
              placeholder="Ex: Utebliven betalning, kund bad om paus, justering av avtal…"
              value={stateReason}
              onChange={(e) => setStateReason(e.target.value)}
            ></textarea>

            <div className="flex justify-end mt-5 gap-3">
              <button
                onClick={() => setShowStateModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 text-sm"
              >
                Avbryt
              </button>

              <button
                onClick={confirmStateChange}
                disabled={stateReason.trim().length < 2 || stateLoading}
                className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${
                  stateLoading || stateReason.trim().length < 2
                    ? "bg-gray-400 cursor-not-allowed"
                    : contractToToggle.active
                    ? "bg-amber-400 hover:bg-amber-500"
                    : "bg-[#D48A62] hover:bg-[#BC7754]"
                }`}
              >
                {stateLoading
                  ? "Sparar…"
                  : contractToToggle.active
                  ? "Pausa"
                  : "Aktivera"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
