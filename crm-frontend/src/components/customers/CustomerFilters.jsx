import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function CustomerFilters({ filters, setFilters }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const typeOptions = [
    { value: "ALL", label: "Alla typer" },
    { value: "PRIVATE", label: "Privat" },
    { value: "BUSINESS", label: "Företag" },
  ];

  const industryOptions = [
    { value: "ALL", label: "Alla branscher" },
    { value: "IT", label: "IT" },
    { value: "FINANCE", label: "Finance" },
    { value: "RETAIL", label: "Retail" },
    { value: "OTHER", label: "Övrigt" },
  ];

  const sortFieldOptions = [
    { value: "company_name", label: "Företag" },
    { value: "org_no", label: "Org.nr" },
    { value: "created_at", label: "Skapad" },
  ];

  const sortDirectionOptions = [
    { value: "asc", label: "A → Ö" },
    { value: "desc", label: "Ö → A" },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 justify-end">

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
        value={filters.customer_type}
        options={typeOptions}
        onChange={(val) => update("customer_type", val)}
      />

      {/* Bransch */}
      <AnimatedSelect
        label="Bransch"
        value={filters.industry}
        options={industryOptions}
        onChange={(val) => update("industry", val)}
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
            rounded-md px-3 py-1.5 text-sm w-36 text-left
            focus:outline-none focus:border-[#165C6D]
          "
        >
          {options.find((o) => o.value === value)?.label}
        </Listbox.Button>

        {/* Animated transparent dropdown with border */}
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
              absolute mt-1 w-36
              bg-transparent text-black z-50
              border border-[#165C6D]/40 rounded-md
              backdrop-blur-md
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
