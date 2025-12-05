import React, { Fragment, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useLookup } from "../../hooks/useLookup";

export default function CustomerFilters({ filters, setFilters, allCustomers }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Hämta lookup-värden (vi hämtar ALLA, inte bara aktiva)
  const { options: industryOptions } = useLookup("industry", false);
  const { options: typeOptions } = useLookup("customer_type", false);

  // ---------------------------------------------
  // 🟢 Bygg upp valbara "typer" baserat på lookup + faktiska kundvärden
  // ---------------------------------------------
  const mergedTypeOptions = useMemo(() => {
    const lookupLabels = typeOptions.map((o) => o.label);

    // Hitta värden i datan som inte finns i lookup
    const missing = [...new Set(allCustomers.map((c) => c.customerType))]
      .filter((val) => val && !lookupLabels.includes(val))
      .map((val) => ({
        value: val,
        label: `(Inaktiv) ${val}`,
      }));

    return [
      { value: "ALL", label: "Alla kundtyper" },
      ...typeOptions,
      ...missing,
    ];
  }, [typeOptions, allCustomers]);

  // ---------------------------------------------
  // 🟢 Bygg upp valbara "branscher"
  // ---------------------------------------------
  const mergedIndustryOptions = useMemo(() => {
    const lookupLabels = industryOptions.map((o) => o.label);

    const missing = [...new Set(allCustomers.map((c) => c.industry))]
      .filter((val) => val && !lookupLabels.includes(val))
      .map((val) => ({
        value: val,
        label: `(Inaktiv) ${val}`,
      }));

    return [
      { value: "ALL", label: "Alla branscher" },
      ...industryOptions,
      ...missing,
    ];
  }, [industryOptions, allCustomers]);

  // Statiska sorteringsalternativ
  const sortFieldOptions = [
    { value: "companyName", label: "Företag" },
    { value: "orgNo", label: "Org.nr" },
    { value: "createdAt", label: "Skapad" },
  ];

  const sortDirectionOptions = [
    { value: "asc", label: "A → Ö" },
    { value: "desc", label: "Ö → A" },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 justify-start">
      {/* Sökfält */}
      <input
        type="text"
        placeholder="Sök kund…"
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
        className="
          border border-[#165C6D]/40 hover:border-[#165C6D]/70
          bg-white text-black 
          rounded-md px-3 py-1.5 text-sm
          focus:outline-none focus:border-[#165C6D] 
        "
      />

      {/* Kundtyp */}
      <AnimatedSelect
        label="Typ"
        value={filters.customerType}
        options={mergedTypeOptions}
        onChange={(val) => update("customerType", val)}
      />

      {/* Bransch */}
      <AnimatedSelect
        label="Bransch"
        value={filters.industry}
        options={mergedIndustryOptions}
        onChange={(val) => update("industry", val)}
      />

      {/* Sortera efter */}
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

/* ----------- ANIMERAD MINIMALISTISK DROPDOWN ----------- */
function AnimatedSelect({ label, value, options, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        {/* Button */}
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

        {/* Dropdown */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <Listbox.Options
            className="
              absolute mt-1 w-40
              bg-white text-black z-50
              border border-[#165C6D]/40 rounded-md
              backdrop-blur-md shadow-lg
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
