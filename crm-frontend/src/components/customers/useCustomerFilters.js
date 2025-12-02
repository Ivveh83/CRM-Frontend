import { useMemo } from "react";

export function useCustomerFilters(customers, filters) {
  return useMemo(() => {
    let list = [...customers];

    // 🔎 Sök
    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter((c) =>
        c.company_name.toLowerCase().includes(s)
      );
    }

    // 🏷 Typ
    if (filters.customer_type !== "ALL") {
      list = list.filter(
        (c) => c.customer_type === filters.customer_type
      );
    }

    // 🏭 Bransch
    if (filters.industry !== "ALL") {
      list = list.filter(
        (c) => c.industry === filters.industry
      );
    }

    // ↕️ Sortering
    list.sort((a, b) => {
      const A = a[filters.sortField];
      const B = b[filters.sortField];

      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [customers, filters]);
}
