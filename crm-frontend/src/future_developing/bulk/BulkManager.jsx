import React, { useState } from "react";
import * as XLSX from "xlsx";

import { customerService } from "../../services/customerService";
import { resellerService } from "../../services/resellerService";
import { contractService } from "../../services/contractService";
import { subscriptionService } from "../../services/subscriptionService";

const ENTITY_TYPES = [
  { value: "customer", label: "Kunder" },
  { value: "reseller", label: "Återförsäljare" },
  { value: "contract", label: "Avtal" },
  { value: "subscription", label: "Abonnemang" },
];

// Map entity → rätt serviceklass
const SERVICE_MAP = {
  customer: customerService,
  reseller: resellerService,
  contract: contractService,
  subscription: subscriptionService,
};

export default function BulkManager() {
  const [selectedType, setSelectedType] = useState("customer");
  const [filePath, setFilePath] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const safeError = (err, fallback = "Ett oväntat fel uppstod.") =>
    err?.response?.data?.errors?.[0] ||
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  // --------------------------------------------------------------
  // IMPORT
  // --------------------------------------------------------------
  const handleImport = async () => {
    if (!filePath.trim()) {
      setServerError("Du måste ange en absolut filsökväg.");
      return;
    }

    setLoading(true);
    setResult(null);
    setServerError("");

    try {
      const service = SERVICE_MAP[selectedType];

      if (!service?.bulkImport) {
        throw new Error(`Service för "${selectedType}" saknar bulkImport().`);
      }

      const res = await service.bulkImport(filePath.trim());
      setResult(res);
    } catch (err) {
      setServerError(safeError(err));
    }

    setLoading(false);
  };

  // --------------------------------------------------------------
  // EXPORT: CSV
  // --------------------------------------------------------------
  const downloadAllCsv = async () => {
    try {
      const service = SERVICE_MAP[selectedType];

      if (!service?.getAll) {
        throw new Error(`Service för "${selectedType}" saknar getAll().`);
      }

      const data = await service.getAll();
      if (!data?.length) return alert("Inga rader att exportera.");

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${selectedType}_export.csv`;
      a.click();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // --------------------------------------------------------------
  // EXPORT: EXCEL
  // --------------------------------------------------------------
  const downloadAllExcel = async () => {
    try {
      const service = SERVICE_MAP[selectedType];

      if (!service?.getAll) {
        throw new Error(`Service för "${selectedType}" saknar getAll().`);
      }

      const data = await service.getAll();
      if (!data?.length) return alert("Inga rader att exportera.");

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      XLSX.writeFile(wb, `${selectedType}_export.xlsx`);
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // --------------------------------------------------------------
  // EXPORT: ERROR CSV (från importresultat)
  // --------------------------------------------------------------
  const downloadErrorCsv = () => {
    if (!result?.failed?.length) return;

    const csv = [
      "Row,Error",
      ...result.failed.map((f) => `${f.row},${f.error}`),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "import_errors.csv";
    a.click();
  };

  // --------------------------------------------------------------
  // UI
  // --------------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Bulkhantering: Importera & Exportera
      </h2>

      {/* ERROR */}
      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-[#E35C67] rounded-lg">
          {serverError}
        </div>
      )}

      {/* Välj typ */}
      <div className="mb-6">
        <label className="font-semibold text-[#165C6D] block mb-1">
          Välj typ av objekt
        </label>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border px-4 py-2 rounded-lg bg-white"
        >
          {ENTITY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Exportknappar */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={downloadAllCsv}
          className="bg-[#6A6FA3] hover:bg-[#565A89] text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          Ladda ner alla (CSV)
        </button>

        <button
          onClick={downloadAllExcel}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          Ladda ner alla (Excel)
        </button>
      </div>

      {/* Filsökväg */}
      <div className="mb-6">
        <label className="font-semibold text-[#165C6D] block mb-1">
          Absolut filsökväg (CSV / Excel)
        </label>

        <input
          type="text"
          placeholder="C:\\temp\\import.xlsx"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full bg-white"
        />
      </div>

      {/* Importknapp */}
      <button
        onClick={handleImport}
        disabled={loading}
        className="bg-[#165C6D] hover:bg-[#0f3f4b] text-white px-6 py-2 rounded-lg font-semibold shadow disabled:opacity-50"
      >
        {loading ? "Importerar..." : "Importera"}
      </button>

      {/* RESULTAT */}
      {result && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-[#165C6D] mb-4">
            Importresultat
          </h3>

          <p className="text-green-700 font-semibold mb-2">
            ✔ Lyckades: {result.successCount}
          </p>

          <p className="text-red-700 font-semibold mb-4">
            ✖ Misslyckades: {result.failed.length}
          </p>

          {result.failed.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#165C6D] text-white">
                    <tr>
                      <th className="py-2 px-3">Rad</th>
                      <th className="py-2 px-3">Fel</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.failed.map((f, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-3">{f.row}</td>
                        <td className="py-2 px-3">{f.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={downloadErrorCsv}
                className="mt-4 bg-[#6A6FA3] hover:bg-[#565A89] text-white px-5 py-2 rounded-lg font-semibold shadow"
              >
                Ladda ner felrapport (CSV)
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
