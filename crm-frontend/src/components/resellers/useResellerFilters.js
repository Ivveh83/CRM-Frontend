import { useMemo } from "react";

export function useResellerFilters(resellers = [], filters = {}) {
  return useMemo(() => {
    // 🛡 Säkerställer att vi alltid jobbar med en array
    const list = Array.isArray(resellers) ? [...resellers] : [];

    if (list.length === 0) return [];

    let result = [...list];

    // 🔎 Sökning (safe access)
    if (filters.search?.trim()) {
      const s = filters.search.toLowerCase();

      result = result.filter((r) =>
        r.name?.toLowerCase().includes(s)
      );
    }

    // 🟡 Aktiv / Inaktiv
    if (filters.status !== "ALL") {
      result = result.filter((r) =>
        filters.status === "ACTIVE" ? r.active : !r.active
      );
    }

    // ↕️ Sortering (felsäker)
    result.sort((a, b) => {
      let A = a?.[filters.sortField];
      let B = b?.[filters.sortField];

      // Datum sortering
      if (filters.sortField === "createdAt") {
        A = A ? new Date(A) : new Date(0);
        B = B ? new Date(B) : new Date(0);
      }

      // Undefined → sortera sist
      if (A == null) return 1;
      if (B == null) return -1;

      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;

      return 0;
    });

    return result;
  }, [resellers, filters]);
}
