import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import Select from "react-select";
import { contractService } from "../../services/contractService";
import { subscriptionService } from "../../services/subscriptionService";
import { resellerService } from "../../services/resellerService";
import { customerService } from "../../services/customerService";

const CreateContract = () => {
  const defaultFormValues = {
    subscriptionIds: [],
    resellerIds: [],
    customerId: null,
    contractLengthMonths: "",
    contractDate: "",
    dueDate: "",
    comment: "",
    active: true,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const contractDate = watch("contractDate");
  const dueDate = watch("dueDate");

  {
    /*USESTATE OCH USEEFFECT FÖR ATT HÄMTA DATA TILL DROPDOWNS FRÅN API*/
  }

  {
    /* State för dropdown-alternativ */
  }

  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [resellerOptions, setResellerOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  {
    /* Hämta alternativ för dropdowns från API vid komponentmount */
  }

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data =
          await subscriptionService.getAllSubscriptionsForContractComponentsDto();

        // Omvandla backend-respons till react-select format
        const formatted = data.map((sub) => ({
          value: sub.id,
          label: sub.name,
        }));

        setSubscriptionOptions(formatted);
      } catch (error) {
        console.error("Kunde inte hämta abonnemang:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const data =
          await resellerService.getAllResellersForContractComponents();

        // Omvandla backend-respons till react-select-format
        const formatted = data.map((reseller) => ({
          value: reseller.id,
          label: reseller.name,
        }));

        setResellerOptions(formatted);
      } catch (error) {
        console.error("Kunde inte hämta återförsäljare:", error);
      }
    };

    fetchResellers();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data =
          await customerService.getAllCustomersForContractComponents();

        // Omvandla backend-responser till react-select format
        const formatted = data.map((cust) => ({
          value: cust.id,
          label: cust.companyName,
        }));

        setCustomerOptions(formatted);
      } catch (error) {
        console.error("Kunde inte hämta kunder:", error);
      }
    };

    fetchCustomers();
  }, []);

  const monthsBetween = (start, end) => {
    if (!start || !end) return 0;

    const s = new Date(start);
    const e = new Date(end);

    return (
      (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
    );
  };

  const onSubmit = async (data) => {
    const dto = {
      customerId: data.customerId.value,
      resellerIds: data.resellerIds.map((r) => r.value),
      subscriptionIds: data.subscriptionIds.map((s) => s.value),
      contractDate: data.contractDate,
      dueDate: data.dueDate,
      contractLengthMonths: Number(data.contractLengthMonths),
      comment: data.comment || null,
      active: data.active.value,
    };

    console.log("DTO som skickas till backend:", dto);

    try {
      const success = await contractService.createContract(dto);

      if (success) {
        alert("Kontrakt skapat!");
        reset(defaultFormValues);
      }
    } catch (error) {
      console.error("Fel vid skapande av kontrakt:", error);

      if (error.response) {
        alert(
          `Fel från servern: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else {
        alert("Ett nätverksfel uppstod.");
      }
    }
  };

  const activeOptions = [
    { value: true, label: "Aktivt" },
    { value: false, label: "Pausat" },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Skapa nytt kontrakt
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
        
        {/* ACTIVE + CONTRACT LENGTH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ACTIVE / PAUSED */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kontraktstatus
            </label>

            <Controller
              name="active"
              control={control}
              defaultValue={activeOptions[0]} // "Aktivt"
              render={({ field }) => (
                <Select
                  {...field}
                  options={activeOptions}
                  placeholder="Välj status…"
                  className="mt-1"
                />
              )}
            />
            {errors.active && (
              <p className="text-red-600 text-sm mt-1">
                {errors.active.message}
              </p>
            )}
          </div>

          {/* CONTRACT LENGTH */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kontraktslängd (månader)
            </label>

            <input
              type="number"
              min="1"
              {...register("contractLengthMonths", {
                required: "Kontraktslängd krävs",
                validate: (value) => {
                  const months = monthsBetween(contractDate, dueDate);
                  return (
                    Number(value) >= months ||
                    `Kontraktslängden måste vara minst ${months} månader`
                  );
                },
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
            className="px-6 py-2 bg-[#E35C67] text-white rounded-lg shadow"
          >
            Registrera kontrakt
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContract;
