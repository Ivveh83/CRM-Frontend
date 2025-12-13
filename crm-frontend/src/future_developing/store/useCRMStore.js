import { create } from "zustand";
import { contractService } from "../../services/contractService";
import { customerService } from "../../services/customerService";
import { resellerService } from "../../services/resellerService";
import { subscriptionService } from "../../services/subscriptionService";

export const useCRMStore = create((set, get) => ({
  // -------------------------
  // 📌 STATE
  // -------------------------
  contracts: [],
  customers: [],
  resellers: [],
  subscriptions: [],

  loading: false,
  error: null,

  // -------------------------
  // 📌 GENERELL HELPER
  // -------------------------
  setLoading: (value) => set({ loading: value }),
  setError: (msg) => set({ error: msg }),

  // -------------------------
  // 📌 HÄMTA ALL DATA
  // -------------------------
  loadAllData: async () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const [contracts, customers, resellers, subscriptions] = await Promise.all([
        contractService.getAllContracts(),
        customerService.getAllCustomersForContractComponents(),
        resellerService.getAllResellersForContractComponents(),
        subscriptionService.getAllSubscriptionsForContractComponentsDto(),
      ]);

      set({
        contracts,
        customers,
        resellers,
        subscriptions,
      });
    } catch (error) {
      console.error("Kunde inte ladda all data:", error);
      setError("Kunde inte ladda data");
    } finally {
      setLoading(false);
    }
  },

  // -------------------------
  // 📌 KONTRAKT CRUD
  // -------------------------
  addContract: async (dto) => {
    await contractService.createContract(dto);
    const updated = await contractService.getAllContracts();
    set({ contracts: updated });
  },

  updateContract: async (id, dto) => {
    await contractService.updateContract(id, dto);
    const updated = await contractService.getAllContracts();
    set({ contracts: updated });
  },

  deleteContract: async (id) => {
    await contractService.deleteContract(id);
    set({
      contracts: get().contracts.filter((c) => c.id !== id),
    });
  },

  // -------------------------
  // 📌 CUSTOMER CRUD
  // -------------------------
  addCustomer: async (dto) => {
    await customerService.createCustomer(dto);
    const updated = await customerService.getAllCustomersForContractComponents();
    set({ customers: updated });
  },

  updateCustomer: async (id, dto) => {
    await customerService.updateCustomer(id, dto);
    const updated = await customerService.getAllCustomersForContractComponents();
    set({ customers: updated });
  },

  deleteCustomer: async (id) => {
    await customerService.deleteCustomer(id);
    set({
      customers: get().customers.filter((c) => c.id !== id),
    });
  },

  // -------------------------
  // 📌 RESELLER CRUD
  // -------------------------
  addReseller: async (dto) => {
    await resellerService.createReseller(dto);
    const updated = await resellerService.getAllResellersForContractComponents();
    set({ resellers: updated });
  },

  updateReseller: async (id, dto) => {
    await resellerService.updateReseller(id, dto);
    const updated = await resellerService.getAllResellersForContractComponents();
    set({ resellers: updated });
  },

  deleteReseller: async (id) => {
    await resellerService.deleteReseller(id);
    set({
      resellers: get().resellers.filter((r) => r.id !== id),
    });
  },

  // -------------------------
  // 📌 SUBSCRIPTIONS CRUD
  // -------------------------
  addSubscription: async (dto) => {
    await subscriptionService.createSubscription(dto);
    const updated = await subscriptionService.getAllSubscriptionsForContractComponentsDto();
    set({ subscriptions: updated });
  },

  updateSubscription: async (id, dto) => {
    await subscriptionService.updateSubscription(id, dto);
    const updated = await subscriptionService.getAllSubscriptionsForContractComponentsDto();
    set({ subscriptions: updated });
  },

  deleteSubscription: async (id) => {
    await subscriptionService.deleteSubscription(id);
    set({
      subscriptions: get().subscriptions.filter((s) => s.id !== id),
    });
  },
}));
