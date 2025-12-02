import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function ResellerFilters({ filters, setFilters }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const statusOptions = [
    { value: "ALL", label: "Alla statusar" },
    { value: "ACTIVE", label: "Aktiva" },
    { value: "INACTIVE", label: "Inaktiva" },
  ];

  const sortFieldOptions = [
    { value: "name", label: "Namn" },
    { value: "orgNo", label: "Org.nr" },
    { value: "createdAt", label: "Skapad" },
  ];

  const sortDirectionOptions = [
    { value: "asc", label: "Stigande ↑" },
    { value: "desc", label: "Fallande ↓" },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 justify-end">

      {/* Sökfält */}
      <input
        type="text"
        placeholder="Sök återförsäljare…"
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
        className="
          border border-[#165C6D]/40 hover:border-[#165C6D]/70
          bg-white text-black 
          rounded-md px-3 py-1.5 text-sm
          focus:outline-none focus:border-[#165C6D] 
        "
      />

      {/* Status */}
      <AnimatedSelect
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(val) => update("status", val)}
      />

      {/* Sorteringsfält */}
      <AnimatedSelect
        label="Sortera efter"
        value={filters.sortField}
        options={sortFieldOptions}
        onChange={(val) => update("sortField", val)}
      />

      {/* Riktning */}
      <AnimatedSelect
        label="Ordning"
        value={filters.sortDirection}
        options={sortDirectionOptions}
        onChange={(val) => update("sortDirection", val)}
      />

    </div>
  );
}


/* ----------- Transparent dropdown + blur + border ----------- */
function AnimatedSelect({ label, value, options, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="
            border border-[#165C6D]/40 hover:border-[#165C6D]/70
            bg-white text-black 
            rounded-md px-3 py-1.5 text-sm w-40 text-left
            focus:outline-none focus:border-[#165C6D]
          "
        >
          {options.find((o) => o.value === value)?.label}
        </Listbox.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Listbox.Options
            className="
              absolute mt-1 w-40
              bg-transparent 
              border border-[#165C6D]/40 rounded-md
              backdrop-blur-md text-black 
              z-50 shadow-none
            "
          >
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  `
                    cursor-pointer px-3 py-1.5 text-sm
                    ${active ? "bg-[#165C6D]/10" : "bg-transparent"}
                  `
                }
              >
                {opt.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
