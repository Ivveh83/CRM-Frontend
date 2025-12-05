import { useEffect, useState } from "react";
import { lookupService } from "../services/lookupService";

export function useLookup(type, activeOnly = false) {

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        // Om activeOnly är true, hämta endast aktiva värden, om false, hämta alla värden
        const res = await lookupService.getLookupValues(type, activeOnly);

        if (!active) return;

        // Convert backend DTO → dropdown format used in UI
        const mapped = res.map((item) => ({
          value: item.label, // internal value
          label: item.label, // user-visible text
          active: item.active,
          sortOrder: item.sortOrder,
        }));

        // Sort by sortOrder
        mapped.sort((a, b) => a.sortOrder - b.sortOrder);

        setOptions(mapped);
      } catch (err) {
        console.error("Error loading lookup:", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [type, activeOnly]);

  return { options, loading };
}
