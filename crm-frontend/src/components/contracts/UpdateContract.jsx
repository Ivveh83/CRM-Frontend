import React, { useState, useEffect, act } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

import { contractService } from "../../services/contractService.js";
import { subscriptionService } from "../../services/subscriptionService.js";
import { resellerService } from "../../services/resellerService.js";
import { customerService } from "../../services/customerService.js";

// Hjälpfunktion som formaterar backend-data till data som passar för att fylla i react-hook-form
function formatContractForForm(
  contract,
  subscriptionOptions,
  resellerOptions,
  customerOptions
) {
  if (!contract) return {};

  return {
    // MATCHA SUBSCRIPTIONS PÅ LABEL
    subscriptionIds: (contract.subscriptionTypes || [])
      .map((s) => subscriptionOptions.find((opt) => opt.value === s.id))
      .filter(Boolean),

    // MATCHA RESELLERS PÅ LABEL
    resellerIds: (contract.resellers || [])
      .map((r) => resellerOptions.find((opt) => opt.value === r.id))
      .filter(Boolean),

    // MATCHA CUSTOMER PÅ LABEL
    customerId:
      customerOptions.find((opt) => opt.value === contract.customer.id) || null,

    contractDate: contract.contractDate?.substring(0, 10) || "",
    dueDate: contract.dueDate?.substring(0, 10) || "",
    renewalDates: (contract.renewalDates || []).map((d) => d.substring(0, 10)),
    contractLengthMonths: contract.contractLengthMonths || "",
    comment: contract.comment || "",
  };
}

const UpdateContract = () => {
  const navigate = useNavigate();
  // ROUTER-LÄGE
  const { state } = useLocation();
  const contractFromList = state?.contract;
  const { contractId } = useParams();

  // DROPDOWN-STATE
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [resellerOptions, setResellerOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  // FORM
  const defaultFormValues = {
    subscriptionIds: [],
    resellerIds: [],
    customerId: null,
    contractLengthMonths: "",
    contractDate: "",
    dueDate: "",
    renewalDates: [],
    comment: "",
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const contractDate = watch("contractDate");
  const dueDate = watch("dueDate");
  const renewalDates = watch("renewalDates");

  const [newRenewalDate, setNewRenewalDate] = useState("");
  const [renewalError, setRenewalError] = useState("");
  const [active, setActive] = useState(true);

  // 🔵 Hämta alla abonnemang
  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await subscriptionService.getAllSubscriptionsForContractComponentsDto();
        setSubscriptionOptions(
          data.map((sub) => ({ value: sub.id, label: sub.name }))
        );
      } catch (err) {
        console.error("Kunde inte hämta abonnemang:", err);
      }
    };
    load();
  }, []);

  // 🟠 Hämta återförsäljare
  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await resellerService.getAllResellersForContractComponents();
        setResellerOptions(data.map((r) => ({ value: r.id, label: r.name })));
      } catch (err) {
        console.error("Kunde inte hämta återförsäljare:", err);
      }
    };
    load();
  }, []);

  // 🟢 Hämta kunder
  useEffect(() => {
    const load = async () => {
      try {
        const data =
          await customerService.getAllCustomersForContractComponents();
        setCustomerOptions(
          data.map((c) => ({ value: c.id, label: c.companyName }))
        );
      } catch (err) {
        console.error("Kunde inte hämta kunder:", err);
      }
    };
    load();
  }, []);

  // 🔥 När dropdowns är laddade → hämta kontrakt eller använd det som kommer som state från ContractsList
  useEffect(() => {
    if (
      subscriptionOptions.length === 0 ||
      resellerOptions.length === 0 ||
      customerOptions.length === 0
    ) {
      return; // vänta tills ALLA dropdowns är laddade
    }

    if (contractFromList) {
      console.log("🟢 DATA FRÅN useLocation.state:", contractFromList);
      setActive(contractFromList.active); 
      reset(
        formatContractForForm(
          contractFromList,
          subscriptionOptions,
          resellerOptions,
          customerOptions
        )
      );
      return;
    }

    const fetchContract = async () => {
      try {
        const data = await contractService.getContractById(contractId);

        console.log("🔵 DATA FRÅN API:", data);
        setActive(contractFromList.active); 

        reset(
          formatContractForForm(
            data,
            subscriptionOptions,
            resellerOptions,
            customerOptions
          )
        );
      } catch (error) {
        console.error("Kunde inte hämta kontraktets data:", error);
      }
    };

    fetchContract();
  }, [
    subscriptionOptions,
    resellerOptions,
    customerOptions,
    contractFromList,
    contractId,
    reset,
  ]);

  // 🔵 Logik för renewalDates
  const addRenewalDate = () => {
    if (!newRenewalDate) {
      setRenewalError("Välj ett förnyelsedatum först");
      return;
    }

    if (contractDate && new Date(newRenewalDate) < new Date(contractDate)) {
      setRenewalError("Förnyelsedatum kan inte vara före kontraktsdatum");
      return;
    }

    if (dueDate && new Date(newRenewalDate) > new Date(dueDate)) {
      setRenewalError("Förnyelsedatum måste vara på eller före förfallodatum");
      return;
    }

    setRenewalError("");
    setValue("renewalDates", [...renewalDates, newRenewalDate]);
    setNewRenewalDate("");
  };

  const removeRenewalDate = (index) => {
    const updated = renewalDates.filter((_, i) => i !== index);
    setValue("renewalDates", updated);
  };

  const onSubmit = async (data) => {
    const dto = {
      customerId: data.customerId.value,
      resellerIds: data.resellerIds.map((r) => r.value),
      subscriptionIds: data.subscriptionIds.map((s) => s.value),
      contractDate: data.contractDate,
      dueDate: data.dueDate,
      contractLengthMonths: Number(data.contractLengthMonths),
      renewalDates: data.renewalDates,
      comment: data.comment || null,
      active: active,
    };

    console.log("DTO vid uppdatering:", dto);

    try {
      await contractService.updateContract(contractId, dto);
      alert("Kontraktet uppdaterat!");
      navigate("/contracts/list");
    } catch (error) {
      alert("Ett fel uppstod vid uppdatering.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera kontrakt
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SUBSCRIPTIONS */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Abonnemang (ett eller flera)
          </label>

          <Controller
            control={control}
            name="subscriptionIds"
            rules={{ required: "Minst ett abonnemang krävs" }}
            render={({ field }) => (
              <Select
                {...field}
                options={subscriptionOptions}
                isMulti
                placeholder="Välj abonnemang…"
                className="mt-1"
              />
            )}
          />

          {errors.subscriptionIds && (
            <p className="text-red-600 text-sm mt-1">
              {errors.subscriptionIds.message}
            </p>
          )}
        </div>

        {/* RESELLERS + CUSTOMER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* RESELLERS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Återförsäljare (en eller flera)
            </label>

            <Controller
              control={control}
              name="resellerIds"
              rules={{ required: "Minst en återförsäljare krävs" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={resellerOptions}
                  isMulti
                  placeholder="Välj återförsäljare…"
                  className="mt-1"
                />
              )}
            />

            {errors.resellerIds && (
              <p className="text-red-600 text-sm mt-1">
                {errors.resellerIds.message}
              </p>
            )}
          </div>

          {/* CUSTOMER */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kund
            </label>

            <Controller
              control={control}
              name="customerId"
              rules={{ required: "Kund måste väljas" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={customerOptions}
                  placeholder="Välj kund..."
                  className="mt-1"
                />
              )}
            />

            {errors.customerId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.customerId.message}
              </p>
            )}
          </div>
        </div>

        {/* DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CONTRACT DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kontraktsdatum
            </label>

            <input
              type="date"
              {...register("contractDate", {
                required: "Kontraktsdatum krävs",
              })}
              className="mt-1 block w-full px-4 py-2 border rounded-lg"
            />

            {errors.contractDate && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contractDate.message}
              </p>
            )}
          </div>

          {/* DUE DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Förfallodatum
            </label>

            <input
              type="date"
              {...register("dueDate", {
                required: "Förfallodatum krävs",
                validate: (value) =>
                  !contractDate ||
                  value >= contractDate ||
                  "Förfallodatum får inte vara före kontraktsdatum",
              })}
              className="mt-1 block w-full px-4 py-2 border rounded-lg"
            />

            {errors.dueDate && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* RENEWAL DATES */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Förnyelsedatum
          </label>

          <div className="flex gap-3 mt-2">
            <input
              type="date"
              value={newRenewalDate}
              onChange={(e) => setNewRenewalDate(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />

            <button
              type="button"
              onClick={addRenewalDate}
              className="bg-[#165C6D] text-white px-4 py-2 rounded-lg"
            >
              Lägg till
            </button>
          </div>

          {renewalError && (
            <p className="text-red-600 text-sm mt-1">{renewalError}</p>
          )}

          <div className="mt-3 space-y-2">
            {renewalDates.map((date, index) => (
              <div
                key={index}
                className="flex justify-between bg-gray-100 rounded-lg px-3 py-2"
              >
                <span>{date}</span>
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => removeRenewalDate(index)}
                >
                  Ta bort
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CONTRACT LENGTH */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kontraktslängd (månader)
            </label>

            <input
              type="number"
              {...register("contractLengthMonths", {
                required: "Kontraktslängd krävs",
              })}
              className="mt-1 block w-full px-4 py-2 border rounded-lg"
            />

            {errors.contractLengthMonths && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contractLengthMonths.message}
              </p>
            )}
          </div>
        </div>

        {/* COMMENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kommentar (valfritt)
          </label>

          <textarea
            {...register("comment")}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border rounded-lg"
          ></textarea>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#165C6D] text-white rounded-lg shadow"
          >
            Uppdatera kontrakt
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateContract;
