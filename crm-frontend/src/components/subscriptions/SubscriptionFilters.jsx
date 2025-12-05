import React, { Fragment, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useLookup } from "../../hooks/useLookup";

export default function SubscriptionFilters({ filters, setFilters, allSubscriptions }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Hämta lookup-värden (alla, även inaktiva)
  const { options: categoryOptions } = useLookup("subscription_category", false);
  const { options: serviceOptions } = useLookup("service_level", false);

  // ---------------------------------------------------------
  // 🟢 KATEGORIER → merge lookup + verkliga data
  // ---------------------------------------------------------
  const mergedCategoryOptions = useMemo(() => {
    const lookupLabels = categoryOptions.map((o) => o.label);

    const missing = [...new Set(allSubscriptions.map((s) => s.category))]
      .filter((val) => val && !lookupLabels.includes(val))
      .map((val) => ({
        value: val,
        label: `(Inaktiv) ${val}`,
      }));

    return [
      { value: "ALL", label: "Alla kategorier" },
      ...categoryOptions,
      ...missing,
    ];
  }, [categoryOptions, allSubscriptions]);

  // ---------------------------------------------------------
  // 🟢 SERVICE LEVEL → merge lookup + verkliga data
  // ---------------------------------------------------------
  const mergedServiceOptions = useMemo(() => {
    const lookupLabels = serviceOptions.map((o) => o.label);

    const missing = [...new Set(allSubscriptions.map((s) => s.serviceLevel))]
      .filter((val) => val && !lookupLabels.includes(val))
      .map((val) => ({
        value: val,
        label: `(Inaktiv) ${val}`,
      }));

    return [
      { value: "ALL", label: "Alla nivåer" },
      ...serviceOptions,
      ...missing,
    ];
  }, [serviceOptions, allSubscriptions]);

  // ---------------------------------------------------------
  // Statiska alternativ
  // ---------------------------------------------------------
  const activeOptions = [
    { value: "ALL", label: "Aktiva & Inaktiva" },
    { value: "ACTIVE", label: "Aktiva" },
    { value: "INACTIVE", label: "Inaktiva" },
  ];

  const sortFieldOptions = [
    { value: "name", label: "Namn" },
    { value: "category", label: "Kategori" },
    { value: "pricePerMonth", label: "Pris" },
    { value: "contractLength", label: "Längd" },
    { value: "createdAt", label: "Skapad" },
  ];

  const sortDirectionOptions = [
    { value: "asc", label: "Stigande ↑" },
    { value: "desc", label: "Fallande ↓" },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 justify-end">
      {/* Search */}
      <input
        type="text"
        placeholder="Sök abonnemang…"
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
        className="
          border border-[#165C6D]/40 hover:border-[#165C6D]/70
          bg-white text-black 
          rounded-md px-3 py-1.5 text-sm
          focus:outline-none focus:border-[#165C6D]
        "
      />

      <AnimatedSelect
        label="Kategori"
        value={filters.category}
        options={mergedCategoryOptions}
        onChange={(val) => update("category", val)}
      />

      <AnimatedSelect
        label="Service nivå"
        value={filters.serviceLevel}
        options={mergedServiceOptions}
        onChange={(val) => update("serviceLevel", val)}
      />

      <AnimatedSelect
        label="Status"
        value={filters.active}
        options={activeOptions}
        onChange={(val) => update("active", val)}
      />

      <AnimatedSelect
        label="Sortera efter"
        value={filters.sortField}
        options={sortFieldOptions}
        onChange={(val) => update("sortField", val)}
      />

      <AnimatedSelect
        label="Ordning"
        value={filters.sortDirection}
        options={sortDirectionOptions}
        onChange={(val) => update("sortDirection", val)}
      />
    </div>
  );
}

/* ----------- Dropdown-komponenten ----------- */
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
              bg-white 
              border border-[#165C6D]/40 rounded-md
              backdrop-blur-md text-black 
              z-50 shadow-lg
            "
          >
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  `cursor-pointer px-3 py-1.5 text-sm ${
                    active ? "bg-[#165C6D]/10" : "bg-transparent"
                  }`
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
