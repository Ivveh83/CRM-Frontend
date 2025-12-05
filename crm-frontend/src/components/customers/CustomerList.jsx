import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, History } from "lucide-react";
import { customerService } from "../../services/customerService";
import { useCustomerFilters } from "./useCustomerFilters";
import CustomerFilters from "./CustomerFilters";
import UuidHistorySearch from "../common/UuidHistorySearch.jsx";

export default function CustomerList() {
  
  const [filters, setFilters] = useState({
    search: "",
    customerType: "ALL",
    industry: "ALL",
    sortField: "companyName",
    sortDirection: "asc",
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getAllCustomerResponseDtos();

        const mapped = data.map((c) => ({
          id: c.id,
          companyName: c.companyName,
          orgNo: c.orgNo,
          contactName: c.contactName,
          country: c.country,
          industry: c.industry,
          customerType: c.customerType,
          createdAt: c.createdAt,
          notes: c.notes,
        }));

        setCustomers(mapped);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Kunde inte hämta kunder.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useCustomerFilters(customers, filters);

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await customerService.deleteCustomer(selectedCustomer.id);

      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));

      alert("Kunden raderades.");
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response?.data?.errors) {
        alert(`Fel: ${error.response.data.errors.join(", ")}`);
      } else {
        alert("Ett fel uppstod när kunden skulle raderas.");
      }
    }

    setShowModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-4">Kundlista</h2>

      {/* UUID-sök + Filter */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <UuidHistorySearch basePath="customers" />
          <CustomerFilters 
    filters={filters} 
    setFilters={setFilters} 
    allCustomers={customers}
/>

        </div>
      </div>

      {loading && <div className="text-gray-700 py-4">Laddar kunder...</div>}
      {error && <div className="text-red-600 py-4">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#165C6D] text-white text-left">
                <th className="py-3 px-4">Företag</th>
                <th className="py-3 px-4">Org.nr</th>
                <th className="py-3 px-4">Kontaktperson</th>
                <th className="py-3 px-4">Land</th>
                <th className="py-3 px-4">Bransch</th>
                <th className="py-3 px-4">Typ</th>
                <th className="py-3 px-4">Skapad</th>
                <th className="py-3 px-4 text-right">Åtgärder</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((c, index) => (
                <tr
                  key={c.id}
                  className={`border-b transition ${
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-[#165C6D]">
                    {c.companyName}
                  </td>

                  <td className="py-3 px-4">{c.orgNo}</td>

                  <td className="py-3 px-4">{c.contactName}</td>

                  <td className="py-3 px-4">{c.country}</td>

                  <td className="py-3 px-4">{c.industry}</td>

                  <td className="py-3 px-4">{c.customerType}</td>

                  <td className="py-3 px-4">{c.createdAt}</td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap justify-end gap-2">

                      {/* SE INFO */}
                      <button
                        className="bg-[#C9E5D9] hover:bg-[#B5D9CA] text-[#165C6D] px-4 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1"
                        onClick={() =>
                          navigate(`/customers/${c.id}`, {
                            state: { customerId: c.id },
                          })
                        }
                      >
                        <Eye size={14} /> Se info
                      </button>

                      {/* UPPDATERA */}
                      <button
                        className="bg-[#6A6FA3] hover:bg-[#565A89] text-white px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1"
                        onClick={() =>
                          navigate(`/customers/update/${c.id}`, {
                            state: { customer: c },
                          })
                        }
                      >
                        <Pencil size={14} /> Uppdatera
                      </button>

                      {/* HISTORIK */}
                      <button
                        className="bg-[#CBD5D8] hover:bg-[#B7C4C8] text-[#165C6D] px-3 py-1 rounded-2xl text-xs font-semibold transition flex items-center gap-1"
                        onClick={() =>
                          navigate(`/customers/${c.id}/history`, {
                            state: { customerId: c.id },
                          })
                        }
                      >
                        <History size={14} /> Historik
                      </button>

                      {/* RADERA */}
                      <button
                        className="bg-[#E35C67] hover:bg-[#C94F59] text-white px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1"
                        onClick={() => handleDeleteClick(c)}
                      >
                        <Trash2 size={14} /> Radera
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-[#165C6D] mb-4">
              Bekräfta borttagning
            </h3>
            <p className="text-gray-700 mb-6">
              Är du säker på att du vill radera kunden{" "}
              <span className="font-mono font-semibold text-[#E35C67]">
                {selectedCustomer.companyName}
              </span>
              ?
              <br />
              <br />
              <b>OBS! Denna åtgärd går inte att ångra.</b>
              <br />
              <br />
              Spara detta ID-nr för framtida referens:{" "}
              <span className="font-mono font-semibold text-[#E35C67]">
                {selectedCustomer.id}
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
    </div>
  );
}
