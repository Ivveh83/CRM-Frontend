import { useMemo } from "react";

export function useSubscriptionFilters(subs, filters) {
  return useMemo(() => {
    let list = [...subs];

    // 🔍 Sökning
    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter((sub) =>
        sub.name.toLowerCase().includes(s)
      );
    }

    // 📦 Kategori
    if (filters.category !== "ALL") {
      list = list.filter((sub) => sub.category === filters.category);
    }

    // ⭐ Service nivå
    if (filters.serviceLevel !== "ALL") {
      list = list.filter((sub) => sub.serviceLevel === filters.serviceLevel);
    }

    // 🔄 Aktiv / Inaktiv
    if (filters.active !== "ALL") {
      list = list.filter((sub) =>
        filters.active === "ACTIVE" ? sub.active : !sub.active
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

  }, [subs, filters]);
}
