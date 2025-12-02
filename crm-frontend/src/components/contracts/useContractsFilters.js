// src/components/Contracts/useContractsFilters.js
import { useMemo } from "react";

export function useContractsFilters(contracts, filters, monthsUntilDue) {
  return useMemo(() => {
    let list = [...contracts];

    // 🔎 Sökning
    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter(c =>
        c.customer.companyName.toLowerCase().includes(s)
      );
    }

    // 🟢 Statusfilter
    if (filters.status !== "ALL") {
      list = list.filter(c => {
        if (filters.status === "OPEN") return c.status === true;
        if (filters.status === "CLOSED") return c.status === false;
        if (filters.status === "PAUSED") return c.active === false;
        return true;
      });
    }

    // 🔄 Aktiv/Pausad
    if (filters.active !== "ALL") {
      list = list.filter(c =>
        filters.active === "ACTIVE" ? c.active : !c.active
      );
    }

    // ↕️ Sortering
    list.sort((a, b) => {
      let A, B;

      switch (filters.sortField) {
        case "customer":
          A = a.customer.companyName;
          B = b.customer.companyName;
          break;
        case "dueDate":
          A = new Date(a.dueDate);
          B = new Date(b.dueDate);
          break;
        case "contractDate":
          A = new Date(a.contractDate);
          B = new Date(b.contractDate);
          break;
        case "monthsLeft":
          A = monthsUntilDue(a.dueDate);
          B = monthsUntilDue(b.dueDate);
          break;
        case "price":
          A = a.totalPricePerMonth;
          B = b.totalPricePerMonth;
          break;
        default:
          return 0;
      }

      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;

  }, [contracts, filters, monthsUntilDue]);
}
