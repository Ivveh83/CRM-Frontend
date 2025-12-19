import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { subscriptionService } from "../../services/subscriptionService";
import { useLookup } from "../../hooks/useLookup";

const UpdateSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [serverError, setServerError] = useState(null);
  const [originalSubscription, setOriginalSubscription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [priceChanged, setPriceChanged] = useState(false);

  // 🔥 Dynamiska lookup-dropdowns (får aktiva värden)
  const { options: categoryOptions } = useLookup("subscription_category", true);
  const { options: levelOptions } = useLookup("service_level", true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: {} });

  // ------------------------------------------------------
  // 🔵 Hämta abonnemang
  // ------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await subscriptionService.getSubscriptionById(id);
        setOriginalSubscription(data);

        reset({
          name: data.name,
          category: data.category,
          description: data.description,
          serviceLevel: data.serviceLevel,
          pricePerMonth: data.pricePerMonth,
          contractLength: data.contractLength,
          renewalPeriod: data.renewalPeriod,
          supportContact: data.supportContact,
          notes: data.notes,
          createdAt: data.createdAt?.substring(0, 10),
        });
      } catch (err) {
        setServerError("Kunde inte hämta abonnemangsdata.");
      }
    };

    load();
  }, [id, reset]);

  // ------------------------------------------------------
  // 🟡 Pre-submit + modal
  // ------------------------------------------------------
  const handlePreSubmit = (data) => {
    setPendingData(data);

    if (originalSubscription) {
      const changed =
        Number(data.pricePerMonth) !==
        Number(originalSubscription.pricePerMonth);
      setPriceChanged(changed);
    }

    setShowModal(true);
  };

  // ------------------------------------------------------
  // 🟢 Bekräfta uppdatering
  // ------------------------------------------------------
  const confirmUpdate = async () => {
    if (!pendingData) return;

    try {
      const dto = {
        name: pendingData.name,
        category: pendingData.category,
        description: pendingData.description,
        serviceLevel: pendingData.serviceLevel,
        pricePerMonth: Number(pendingData.pricePerMonth),
        contractLength: Number(pendingData.contractLength),
        renewalPeriod: Number(pendingData.renewalPeriod),
        supportContact: pendingData.supportContact,
        notes: pendingData.notes,
        createdAt: pendingData.createdAt,
      };

      await subscriptionService.updateSubscription(id, dto);
      navigate("/subscriptions/list");
    } catch (err) {
      setServerError("Fel vid uppdatering.");
    }
  };

  // ------------------------------------------------------
  // ⛔ Lägg till "(Inaktiv)" option om ett gammalt värde inte längre finns
  // ------------------------------------------------------
  const mergedDropdown = (options, currentValue) => {
    const exists = options.some((o) => o.value === currentValue);

    if (!exists && currentValue) {
      return [
        ...options,
        { value: currentValue, label: `(Inaktiv) ${currentValue}` },
      ];
    }

    return options;
  };

  const categoryList = mergedDropdown(
    categoryOptions,
    originalSubscription?.category
  );
  const levelList = mergedDropdown(
    levelOptions,
    originalSubscription?.serviceLevel
  );

  // ------------------------------------------------------
  // 🖼️ UI
  // ------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera abonnemang
      </h2>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-[#E35C67] rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-6">
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Abonnemangsnamn
          </label>
          <input
            {...register("name", { required: "Namn krävs" })}
            type="text"
            placeholder="Ex. Threat Monitoring Basic"
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.name && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            {...register("category")}
            className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Välj kategori</option>
            {categoryList.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Beskrivning
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.description && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* SERVICE LEVEL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service-nivå (SLA)
          </label>
          <select
            {...register("serviceLevel")}
            className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Välj nivå</option>
            {levelList.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.serviceLevel && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.serviceLevel.message}
            </p>
          )}
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pris per månad (SEK)
          </label>
          <input
            {...register("pricePerMonth", { required: "Pris krävs" })}
            type="number"
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.pricePerMonth && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.pricePerMonth.message}
            </p>
          )}
        </div>

        {/* CONTRACT LENGTH */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kontraktslängd (månader)
          </label>
          <input
            {...register("contractLength", {
              required: "Kontraktslängd krävs",
            })}
            type="number"
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.contractLength && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.contractLength.message}
            </p>
          )}
        </div>

        {/* RENEWAL PERIOD */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Förnyelseperiod (månader)
          </label>
          <input
            {...register("renewalPeriod")}
            type="number"
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.renewalPeriod && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.renewalPeriod.message}
            </p>
          )}
        </div>

        {/* SUPPORT CONTACT */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supportkontakt (e-post)
          </label>
          <input
            {...register("supportContact")}
            type="email"
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.supportContact && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.supportContact.message}
            </p>
          )}
        </div>

        {/* NOTES */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Anteckningar
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.notes && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* CREATED AT */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skapad (datum)
          </label>
          <input
            {...register("createdAt")}
            type="date"
            className="mt-1 block w-full border px-4 py-2 rounded-lg"
          />
          {errors.createdAt && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.createdAt.message}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-[#165C6D] text-white rounded-lg">
            Uppdatera abonnemang
          </button>
        </div>
      </form>

      {/* CONFIRM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow max-w-sm">
            <h3 className="text-xl font-bold text-[#165C6D] mb-4">
              Bekräfta ändringar
            </h3>

            {priceChanged ? (
              <p className="text-red-600 mb-6">
                Prisändringar påverkar alla kontrakt kopplade till abonnemanget.
              </p>
            ) : (
              <p className="text-gray-700 mb-6">
                Ingen prisändring — endast information uppdateras.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Avbryt
              </button>

              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-[#165C6D] text-white rounded"
              >
                Uppdatera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateSubscription;
