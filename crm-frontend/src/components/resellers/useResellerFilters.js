import { useMemo } from "react";

export function useResellerFilters(resellers, filters) {
  return useMemo(() => {
    let list = [...resellers];

    // 🔎 Sökning
    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(s)
      );
    }

    // 🟡 Status (active/inactive)
    if (filters.status !== "ALL") {
      list = list.filter((r) =>
        filters.status === "ACTIVE" ? r.active : !r.active
      );
    }

    // ↕️ Sortering
    list.sort((a, b) => {
      let A = a[filters.sortField];
      let B = b[filters.sortField];

      // Datum sortering
      if (filters.sortField === "createdAt") {
        A = new Date(A);
        B = new Date(B);
      }

      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [resellers, filters]);
}
