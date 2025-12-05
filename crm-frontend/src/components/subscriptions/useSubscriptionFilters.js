import { useMemo } from "react";

export function useSubscriptionFilters(subs = [], filters = {}) {
  return useMemo(() => {
    // 🛡 Säkerställer att vi jobbar med en array
    const list = Array.isArray(subs) ? [...subs] : [];

    if (list.length === 0) return [];

    let result = [...list];

    // 🔍 Sökning (safe access)
    if (filters.search?.trim()) {
      const s = filters.search.toLowerCase();

      result = result.filter((sub) =>
        sub.name?.toLowerCase().includes(s)
      );
    }

    // 📦 Kategori
    if (filters.category !== "ALL") {
      result = result.filter((sub) =>
        sub.category === filters.category
      );
    }

    // ⭐ Service-nivå
    if (filters.serviceLevel !== "ALL") {
      result = result.filter((sub) =>
        sub.serviceLevel === filters.serviceLevel
      );
    }

    // 🔄 Aktiv / Inaktiv
    if (filters.active !== "ALL") {
      result = result.filter((sub) =>
        filters.active === "ACTIVE" ? sub.active : !sub.active
      );
    }

    // ↕️ Sortering (fallsäkert)
    result.sort((a, b) => {
      let A = a?.[filters.sortField];
      let B = b?.[filters.sortField];

      // Undefined → sortera sist
      if (A == null) return 1;
      if (B == null) return -1;

      // Numerisk sortering vid pris
      if (typeof A === "number" && typeof B === "number") {
        return filters.sortDirection === "asc" ? A - B : B - A;
      }

      // Datum sortering
      if (filters.sortField === "createdAt") {
        A = A ? new Date(A) : new Date(0);
        B = B ? new Date(B) : new Date(0);
      }

      // String / fallback sortering
      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;

      return 0;
    });

    return result;

  }, [subs, filters]);
}
