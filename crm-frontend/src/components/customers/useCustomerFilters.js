import { useMemo } from "react";

export function useCustomerFilters(customers = [], filters = {}) {
  return useMemo(() => {
    // 🛡 Säkerställ att vi alltid jobbar med en array
    const list = Array.isArray(customers) ? [...customers] : [];

    if (list.length === 0) return [];

    let result = [...list];

    // 🔎 Sökning (safe access)
    if (filters.search?.trim()) {
      const s = filters.search.toLowerCase();

      result = result.filter((c) =>
        c.companyName?.toLowerCase().includes(s)
      );
    }

    // 🏷 Typfilter
    if (filters.customerType !== "ALL") {
      result = result.filter(
        (c) => c.customerType === filters.customerType
      );
    }

    // 🏭 Branschfilter
    if (filters.industry !== "ALL") {
      result = result.filter(
        (c) => c.industry === filters.industry
      );
    }

    // ↕️ Sortering (extra säker)
    result.sort((a, b) => {
      const A = a[filters.sortField] ?? "";
      const B = b[filters.sortField] ?? "";

      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [customers, filters]);
}
