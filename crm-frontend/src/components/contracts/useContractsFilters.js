// src/components/Contracts/useContractsFilters.js
import { useMemo } from "react";

export function useContractsFilters(
  contracts = [],
  filters = {},
  monthsUntilDue
) {
  return useMemo(() => {
    // 🛡 Gör alltid om contracts till en säker array
    const list = Array.isArray(contracts) ? [...contracts] : [];

    // Om tom lista → returnera direkt och undvik jobb
    if (list.length === 0) return [];

    let result = [...list];

    // 🔎 SÖKNING (safe access)
    if (filters.search?.trim()) {
      const s = filters.search.toLowerCase();

      result = result.filter((c) =>
        c.customer?.companyName?.toLowerCase().includes(s)
      );
    }

    // 🟢 STATUSFILTER
    if (filters.status !== "ALL") {
      result = result.filter((c) => {
        if (filters.status === "OPEN") return c.status === true;
        if (filters.status === "CLOSED") return c.status === false;
        if (filters.status === "PAUSED") return c.active === false;
        return true;
      });
    }

    // 🔄 AKTIV / PAUSAD
    if (filters.active !== "ALL") {
      result = result.filter((c) =>
        filters.active === "ACTIVE" ? c.active : !c.active
      );
    }

    // ↕️ SORTERING (helt säkert)
    result.sort((a, b) => {
      let A, B;

      switch (filters.sortField) {
        case "customer":
          A = a.customer?.companyName ?? "";
          B = b.customer?.companyName ?? "";
          break;

        case "orgNo":
          A = a.customer?.orgNo ?? "";
          B = b.customer?.orgNo ?? "";
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
          A = monthsUntilDue?.(a.dueDate) ?? 0;
          B = monthsUntilDue?.(b.dueDate) ?? 0;
          break;

        case "price":
          A = a.totalPricePerMonth ?? 0;
          B = b.totalPricePerMonth ?? 0;
          break;

        default:
          return 0;
      }

      if (A < B) return filters.sortDirection === "asc" ? -1 : 1;
      if (A > B) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [contracts, filters, monthsUntilDue]);
}
