import React, { useEffect, useState } from "react";
import { lookupService } from "../../services/lookupService";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { PauseCircle, PlayCircle } from "lucide-react";

const LOOKUP_TYPES = [
  { value: "industry", label: "Branscher (Kund)" },
  { value: "customer_type", label: "Kundtyper (Kund)" },
  { value: "subscription_category", label: "Tjänstekategorier (Abonnemang)" },
  { value: "service_level", label: "Service-levels ((Abonnemang)" },
];

// --------------------------------------------------
// Sortable Row Component
// --------------------------------------------------
function SortableRow({ item, onUpdate, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const [label, setLabel] = useState(item.label);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setLabel(item.label);
  }, [item.label]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b transition ${
        !item.active ? "bg-yellow-50" : "bg-white"
      }`}
    >
      {/* Drag handle */}
      <td
        {...attributes}
        {...listeners}
        className="cursor-grab px-4 py-3 text-gray-500 select-none"
      >
        ≡
      </td>

      {/* Name field */}
      <td className="px-4 py-3 w-1/3">
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            setChanged(e.target.value.trim() !== item.label.trim());
          }}
          className="border px-3 py-1 rounded-lg w-full bg-white focus:outline-none focus:border-[#165C6D]"
        />

        {changed && (
          <button
            onClick={() => {
              onUpdate(item.id, label);
              setChanged(false);
            }}
            className="mt-2 px-3 py-1 bg-[#6A6FA3] hover:bg-[#565A89] text-white text-xs font-semibold rounded-lg shadow"
          >
            Uppdatera
          </button>
        )}
      </td>

      {/* Sort order */}
      <td className="px-4 py-3 w-20 text-gray-600">{item.sortOrder}</td>

      {/* Actions */}
      <td className="px-4 py-3 w-40">
        <div className="flex justify-end">
          <button
            onClick={() => onToggle(item.id, !item.active)}
            className={`px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 transition
              ${
                item.active
                  ? "bg-amber-300 hover:bg-amber-400 text-[#165C6D] rounded-xl"
                  : "bg-[#D48A62] hover:bg-[#BC7754] text-white rounded-full"
              }
            `}
          >
            {item.active ? <PauseCircle size={12} /> : <PlayCircle size={12} />}
            {item.active ? "Inaktivera" : "Aktivera"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// --------------------------------------------------
// Main Component
// --------------------------------------------------
export default function LookupManager() {
  const [selectedType, setSelectedType] = useState("industry");
  const [values, setValues] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(1);
  const [serverError, setServerError] = useState("");

  const safeError = (err, fallback = "Ett oväntat fel uppstod.") =>
    err?.response?.data?.errors?.[0] ||
    err?.response?.data?.message ||
    err?.message ||
    fallback;

  // Load values
  const loadValues = async () => {
    try {
      const res = await lookupService.getLookupValues(selectedType);

      const sorted = res
        .map((v) => ({
          id: v.id,
          label: v.label,
          sortOrder: Number(v.sortOrder),
          active: Boolean(v.active),
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder);

      setValues(sorted);
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  useEffect(() => {
    loadValues();
  }, [selectedType]);

  // Update active state
  const updateActive = async (id, active) => {
    try {
      await lookupService.updateLookupActive(id, active);
      loadValues();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // Update label
  const updateLabel = async (id, label) => {
    try {
      await lookupService.updateLookup(id, {
        label,
        sortOrder: values.find((x) => x.id === id).sortOrder,
      });
      loadValues();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // Create new
  const createValue = async () => {
    try {
      if (!newLabel.trim()) return setServerError("Namn kan inte vara tomt.");

      await lookupService.createLookupValue({
        type: selectedType,
        label: newLabel.trim(),
        sortOrder: Number(newSortOrder),
      });

      setNewLabel("");
      setNewSortOrder(1);
      loadValues();
    } catch (err) {
      setServerError(safeError(err));
    }
  };

  // Drag-and-drop reorder
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = values.findIndex((i) => i.id === active.id);
    const newIndex = values.findIndex((i) => i.id === over.id);

    const reordered = arrayMove(values, oldIndex, newIndex).map((v, i) => ({
      ...v,
      sortOrder: i + 1,
    }));

    setValues(reordered);

    lookupService.reorderLookupValues(
      selectedType,
      reordered.map((v) => ({ id: v.id, sortOrder: v.sortOrder }))
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Hantera Lookup-värden
      </h2>

      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 text-[#E35C67] rounded-lg">
          {serverError}
        </div>
      )}

      {/* Select category */}
      <div className="mb-8">
        <label className="font-semibold text-[#165C6D] block mb-1">
          Välj kategori
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border px-4 py-2 rounded-lg bg-white"
        >
          {LOOKUP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">

        {/* DnD MUST wrap the ENTIRE table, NOT tbody */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={values.map((v) => v.id)}
            strategy={verticalListSortingStrategy}
          >

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#165C6D] text-white text-left">
                  <th className="py-3 px-4 w-10"></th>
                  <th className="py-3 px-4">Namn</th>
                  <th className="py-3 px-4">Placering</th>
                  <th className="py-3 px-4 text-right">Åtgärder</th>
                </tr>
              </thead>

              <tbody>
                {values.map((v) => (
                  <SortableRow
                    key={v.id}
                    item={v}
                    onUpdate={updateLabel}
                    onToggle={updateActive}
                  />
                ))}
              </tbody>
            </table>

          </SortableContext>
        </DndContext>

      </div>

      {/* Create new */}
      <h3 className="text-lg font-semibold text-[#165C6D] mt-8 mb-3">
        Skapa nytt värde
      </h3>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Namn"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full"
        />

        <input
          type="number"
          min="1"
          value={newSortOrder}
          onChange={(e) =>
            setNewSortOrder(Math.max(1, Number(e.target.value)))
          }
          className="border px-4 py-2 rounded-lg w-24"
        />

        <button
          onClick={createValue}
          className="bg-[#E35C67] hover:bg-[#C94F59] text-white px-5 py-2 rounded-lg font-semibold shadow"
        >
          + Lägg till
        </button>
      </div>
    </div>
  );
}
