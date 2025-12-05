import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

import { contractService } from "../../services/contractService.js";
import { subscriptionService } from "../../services/subscriptionService.js";
import { resellerService } from "../../services/resellerService.js";
import { customerService } from "../../services/customerService.js";

// Format backend contract for react-hook-form
function formatContractForForm(
  contract,
  subscriptionOptions,
  resellerOptions,
  customerOptions
) {
  if (!contract) return {};

  return {
    subscriptionIds: (contract.subscriptionTypes || [])
      .map((s) => subscriptionOptions.find((opt) => opt.value === s.id))
      .filter(Boolean),

    resellerIds: (contract.resellers || [])
      .map((r) => resellerOptions.find((opt) => opt.value === r.id))
      .filter(Boolean),

    customerId:
      customerOptions.find((opt) => opt.value === contract.customer.id) || null,

    contractDate: contract.contractDate?.substring(0, 10) || "",
    dueDate: contract.dueDate?.substring(0, 10) || "",
    renewalDates: (contract.renewalDates || []).map((d) => d.substring(0, 10)),
    contractLengthMonths: contract.contractLengthMonths || "",
    comment: contract.comment || "",

    totalPricePerMonth: contract.totalPricePerMonth || 0,
  };
}

// Helper: antal månader mellan två datum
function monthsBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
}

const UpdateContract = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const contractFromList = state?.contract;
  const { contractId } = useParams();

  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [resellerOptions, setResellerOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [backendErrors, setBackendErrors] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [active, setActive] = useState(true);

  // ORIGINAL values (för autosum-logik)
  const originalTotalPrice = useRef(0);
  const originalSubIds = useRef([]);

  const skipAutoSum = useRef(true);
  const hasJustReset = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedSubscriptions = watch("subscriptionIds") || [];
  const contractDate = watch("contractDate");
  const dueDate = watch("dueDate");

  // ---- Hämta abonnemang ----
  useEffect(() => {
    (async () => {
      const data =
        await subscriptionService.getAllSubscriptionsForContractComponentsDto();

      setSubscriptionOptions(
        data.map((sub) => ({
          value: sub.id,
          label: `${sub.name} (${sub.pricePerMonth} kr/mån)`,
          pricePerMonth: sub.pricePerMonth,
        }))
      );
    })();
  }, []);

  // ---- Hämta återförsäljare ----
  useEffect(() => {
    (async () => {
      const data =
        await resellerService.getAllResellersForContractComponents();

      setResellerOptions(
        data.map((r) => ({
          value: r.id,
          label: `${r.name} (${r.orgNo})`,
        }))
      );
    })();
  }, []);

  // ---- Hämta kunder ----
  useEffect(() => {
    (async () => {
      const data =
        await customerService.getAllCustomersForContractComponents();

      setCustomerOptions(
        data.map((c) => ({
          value: c.id,
          label: `${c.companyName} (${c.orgNo})`,
        }))
      );
    })();
  }, []);

  // ---- Hämta kontrakt när options är redo ----
  useEffect(() => {
    if (
      subscriptionOptions.length === 0 ||
      resellerOptions.length === 0 ||
      customerOptions.length === 0
    )
      return;

    const load = async () => {
      const data =
        contractFromList || (await contractService.getContractById(contractId));

      originalTotalPrice.current = data.totalPricePerMonth;
      originalSubIds.current = data.subscriptionTypes.map((s) => s.id);

      setActive(data.active);
      setTotalPrice(data.totalPricePerMonth);

      skipAutoSum.current = true;
      hasJustReset.current = true;

      reset(
        formatContractForForm(
          data,
          subscriptionOptions,
          resellerOptions,
          customerOptions
        )
      );
    };

    load();
  }, [
    subscriptionOptions,
    resellerOptions,
    customerOptions,
    contractFromList,
    contractId,
    reset,
  ]);

  // ---- Efter reset: slå på autosum först efter RHF:s första interna ändring ----
  useEffect(() => {
    if (hasJustReset.current) {
      hasJustReset.current = false;
      return;
    }

    if (skipAutoSum.current) {
      skipAutoSum.current = false;
    }
  }, [selectedSubscriptions]);

  // ---- SMART AUTOSUM LOGIC ----
  useEffect(() => {
    if (skipAutoSum.current) return;
    if (!selectedSubscriptions || subscriptionOptions.length === 0) return;

    const currentSubIds = selectedSubscriptions.map((s) => s.value);

    const hasRemovedOriginalInternal = originalSubIds.current.some(
      (id) => !currentSubIds.includes(id)
    );

    // CASE 1: original-abonnemang borttaget → full autosum
    if (hasRemovedOriginalInternal) {
      const sum = currentSubIds.reduce((acc, id) => {
        const obj = subscriptionOptions.find((o) => o.value === id);
        return acc + (obj?.pricePerMonth || 0);
      }, 0);

      setTotalPrice(sum);
      return;
    }

    // CASE 2: inga original borttagna → originalpris + nya abonnemang
    const addedSubs = currentSubIds.filter(
      (id) => !originalSubIds.current.includes(id)
    );

    const addedSum = addedSubs.reduce((acc, id) => {
      const obj = subscriptionOptions.find((o) => o.value === id);
      return acc + (obj?.pricePerMonth || 0);
    }, 0);

    setTotalPrice(originalTotalPrice.current + addedSum);
  }, [selectedSubscriptions, subscriptionOptions]);

  // ---- Deriverade värden för prisöversikten ----

  // Ids för nuvarande val
  const currentSubIds = selectedSubscriptions.map((s) => s.value);

  // Har något av de ursprungliga abonnemangen tagits bort?
  const hasRemovedOriginal = originalSubIds.current.some(
    (id) => !currentSubIds.includes(id)
  );

  // Alla valda abonnemangsobjekt (via options)
  const allSubObjects =
    currentSubIds
      .map((id) => subscriptionOptions.find((o) => o.value === id))
      .filter(Boolean) || [];

  // Summan av alla nuvarande abonnemangs ordinarie pris (detta är "ordinarie totalsumma")
  const fullPriceTotal = allSubObjects.reduce(
    (acc, s) => acc + (s?.pricePerMonth || 0),
    0
  );

  // Rabatt/påslag = ordinarie total - manuellt pris
  const discountAmount = fullPriceTotal - totalPrice;

  const onSubmit = async (data) => {
    try {
      const dto = {
        customerId: data.customerId.value,
        resellerIds: data.resellerIds.map((r) => r.value),
        subscriptionIds: data.subscriptionIds.map((s) => s.value),
        contractDate: data.contractDate,
        dueDate: data.dueDate,
        renewalDates: data.renewalDates,
        contractLengthMonths: Number(data.contractLengthMonths),
        totalPricePerMonth: totalPrice,
        comment: data.comment || null,
        active: active,
      };

      await contractService.updateContract(contractId, dto);
      alert("Kontraktet uppdaterat!");
      navigate("/contracts/list");
    } catch (err) {
      setBackendErrors(
        err?.response?.data?.errors || ["Ett okänt fel inträffade"]
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera kontrakt
      </h2>

      {/* BACKEND ERRORS */}
      {backendErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-red-700 mb-2">
            Fel vid uppdatering:
          </h3>
          <ul className="list-disc ml-5 text-red-700">
            {backendErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SUBSCRIPTIONS */}
        <div>
          <label className="block text-sm font-medium">Abonnemang *</label>
          <Controller
            control={control}
            name="subscriptionIds"
            rules={{
              validate: (v) => v?.length > 0 || "Minst ett abonnemang krävs",
            }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={subscriptionOptions}
                placeholder="Välj abonnemang…"
              />
            )}
          />
          {errors.subscriptionIds && (
            <p className="text-red-600 text-sm">
              {errors.subscriptionIds.message}
            </p>
          )}
        </div>

        {/* TOTAL PRICE */}
        <div>
          <label className="block text-sm font-medium">
            Manuellt totalpris (kr/mån)
          </label>
          <input
            type="number"
            step="0.01"
            value={totalPrice}
            onChange={(e) => setTotalPrice(Number(e.target.value))}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        {/* PRICE BREAKDOWN */}
        <div className="p-4 bg-gray-100 rounded-lg border text-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base tracking-tight">
            Prisöversikt
          </h3>

          {/* MEDDELANDE OM BORTTAGET ORIGINAL-ABONNEMANG */}
          {hasRemovedOriginal && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs px-3 py-2 rounded">
              Ett eller flera ursprungliga abonnemang har tagits bort.
              <br />
              <span className="font-semibold">
                Manuellt pris justeras automatiskt i detta läge.
              </span>
            </div>
          )}

          {/* LIST ALL CURRENT SUBSCRIPTIONS */}
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-800 text-sm">
              Valda abonnemang
            </h4>

            {allSubObjects.map((sub) => {
              const isAdded = !originalSubIds.current.includes(sub.value);

              return (
                <div
                  key={sub.value}
                  className={`flex justify-between items-center px-2 py-1 rounded
                    ${isAdded ? "bg-green-50 border border-green-200" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {isAdded && (
                      <span className="text-green-700 font-bold text-lg leading-none">
                        +
                      </span>
                    )}

                    <span
                      className={`${
                        isAdded
                          ? "text-green-800 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {sub.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdded && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                        NYTT
                      </span>
                    )}
                    <span
                      className={`font-medium ${
                        isAdded
                          ? "text-green-800 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {sub.pricePerMonth} kr
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between font-semibold text-gray-900 border-t pt-1 mt-2">
              <span>Ordinarie totalsumma</span>
              <span>{fullPriceTotal} kr</span>
            </div>
          </div>

          <div className="flex justify-between font-semibold text-blue-800">
            <span>Manuellt pris</span>
            <span>{totalPrice} kr</span>
          </div>

          {/* DISCOUNT OR MARKUP */}
          {discountAmount > 0 && (
            <div className="flex justify-between items-center font-bold text-green-700 text-base">
              <span>Rabatt</span>
              <span>{discountAmount} kr</span>
            </div>
          )}

          {discountAmount < 0 && (
            <div className="flex justify-between items-center font-bold text-red-700 text-base">
              <span>Påslag</span>
              <span>{Math.abs(discountAmount)} kr</span>
            </div>
          )}

          {discountAmount === 0 && (
            <p className="text-gray-500 text-sm">Ingen rabatt eller påslag.</p>
          )}
        </div>

        {/* RESELLER & CUSTOMER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm">Återförsäljare *</label>
            <Controller
              control={control}
              name="resellerIds"
              rules={{
                validate: (v) =>
                  v?.length > 0 || "Minst en återförsäljare krävs",
              }}
              render={({ field }) => (
                <Select {...field} isMulti options={resellerOptions} />
              )}
            />
            {errors.resellerIds && (
              <p className="text-red-600 text-sm">
                {errors.resellerIds.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Kund *</label>
            <Controller
              control={control}
              name="customerId"
              rules={{ required: "Kund måste väljas" }}
              render={({ field }) => <Select {...field} options={customerOptions} />}
            />
            {errors.customerId && (
              <p className="text-red-600 text-sm">
                {errors.customerId.message}
              </p>
            )}
          </div>
        </div>

        {/* DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm">Kontraktsdatum *</label>
            <input
              type="date"
              {...register("contractDate", {
                required: "Kontraktsdatum krävs",
              })}
              className="border rounded-lg p-2 w-full"
            />
            {errors.contractDate && (
              <p className="text-red-600 text-sm">
                {errors.contractDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Förfallodatum *</label>
            <input
              type="date"
              {...register("dueDate", {
                required: "Förfallodatum krävs",
                validate: (value) => {
                  if (!contractDate) return true;
                  return new Date(value) >= new Date(contractDate)
                    ? true
                    : "Förfallodatum får inte vara före kontraktsdatum";
                },
              })}
              className="border rounded-lg p-2 w-full"
            />
            {errors.dueDate && (
              <p className="text-red-600 text-sm">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* CONTRACT LENGTH */}
        <div>
          <label className="block text-sm">Kontraktslängd (månader) *</label>
          <input
            type="number"
            min="1"
            {...register("contractLengthMonths", {
              required: "Kontraktslängd krävs",
              validate: (value) => {
                if (!contractDate || !dueDate) return true;
                const diff = monthsBetween(contractDate, dueDate);
                return value >= diff
                  ? true
                  : `Kontraktslängden kan inte vara kortare än ${diff} månader`;
              },
            })}
            className="border rounded-lg p-2 w-full"
          />
          {errors.contractLengthMonths && (
            <p className="text-red-600 text-sm">
              {errors.contractLengthMonths.message}
            </p>
          )}
        </div>

        {/* COMMENT */}
        <div>
          <label className="block text-sm">Kommentar</label>
          <textarea
            {...register("comment")}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-[#165C6D] text-white rounded-lg">
            Uppdatera kontrakt
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateContract;
