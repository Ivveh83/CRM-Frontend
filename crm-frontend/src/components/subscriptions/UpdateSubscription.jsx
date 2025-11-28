import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import { subscriptionService } from "../../services/subscriptionService";

// === Mockade dropdownvärden (enkelt ersätt med API senare) ===
const CATEGORY_OPTIONS = [
  { value: "Threat Monitoring", label: "Threat Monitoring" },
  { value: "Penetration Testing", label: "Penetration Testing" },
  { value: "Vulnerability Management", label: "Vulnerability Management" },
  { value: "Incident Response", label: "Incident Response" },
  { value: "SOC-as-a-Service", label: "SOC-as-a-Service" },
  { value: "Endpoint Protection", label: "Endpoint Protection" },
  { value: "Security Awareness Training", label: "Security Awareness Training" },
];

const SERVICE_LEVEL_OPTIONS = [
  { value: "Bronze (kontorstid)", label: "Bronze (kontorstid)" },
  { value: "Silver (12/5 support)", label: "Silver (12/5 support)" },
  { value: "Gold (24/7 support)", label: "Gold (24/7 support)" },
  { value: "Platinum (dedikerad SOC)", label: "Platinum (dedikerad SOC)" },
];

const ACTIVE_OPTIONS = [
  { value: true, label: "Aktivt" },
  { value: false, label: "Inaktivt" },
];

const fetchSubscription = async (id) => {
  try {
    const response = await subscriptionService.getSubscriptionById(id);

    // Backend returnerar SubscriptionResponseDto
    // Mappar rakt igenom utan förändringar
    return {
      id: response.id,
      name: response.name,
      category: response.category,
      description: response.description,
      serviceLevel: response.serviceLevel,
      pricePerMonth: response.pricePerMonth,
      contractLength: response.contractLength,
      renewalPeriod: response.renewalPeriod,
      active: response.active,
      supportContact: response.supportContact,
      createdAt: response.createdAt,
      notes: response.notes,
    };
  } catch (error) {
    console.error("Fel vid API-hämtning av abonnemang:", error);
    throw error;
  }
};

const UpdateSubscription = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const subscriptionFromList = state?.subscription;
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // === Load subscription data (from state OR mock-API) ===
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        if (subscriptionFromList) {
          reset(formatForForm(subscriptionFromList));
          return;
        }

        const data = await fetchSubscription(id);
        reset(formatForForm(data));
      } catch (error) {
        console.error("Fel vid hämtning av abonnemang:", error);
        setServerError("Kunde inte hämta abonnemangets information.");
      }
    };

    loadSubscription();
  }, [subscriptionFromList, id, reset]);

  // === Formatera backend-data → form-format ===
  const formatForForm = (data) => ({
    name: data.name,
    category: CATEGORY_OPTIONS.find((o) => o.value === data.category),
    description: data.description,
    serviceLevel: SERVICE_LEVEL_OPTIONS.find((o) => o.value === data.serviceLevel),
    pricePerMonth: data.pricePerMonth,
    contractLength: data.contractLength,
    renewalPeriod: data.renewalPeriod,
    supportContact: data.supportContact,
    active: ACTIVE_OPTIONS.find((o) => o.value === data.active),
    notes: data.notes,
    createdAt: data.createdAt?.substring(0, 10),
  });

  // === Submit ===
  const onSubmit = async (data) => {
    try {
      setServerError(null);

      const dto = {
        name: data.name,
        category: data.category.value,
        description: data.description,
        serviceLevel: data.serviceLevel.value,
        pricePerMonth: Number(data.pricePerMonth),
        contractLength: Number(data.contractLength),
        renewalPeriod: Number(data.renewalPeriod),
        supportContact: data.supportContact,
        active: data.active.value,
        notes: data.notes,
        createdAt: data.createdAt,
      };

      console.log("DTO som skickas till backend:", dto);

 await subscriptionService.updateSubscription(id, dto);

      navigate("/subscriptions/list");
    } catch (error) {
      setServerError("Ett fel inträffade vid uppdatering.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera abonnemang
      </h2>

      {serverError && (
        <p className="text-sm text-[#E35C67] bg-red-50 border border-red-300 px-3 py-2 rounded-lg shadow-sm mb-4">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Abonnemangsnamn</label>
          <input
            {...register("name", { required: "Namn krävs" })}
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.name && <p className="text-sm text-[#E35C67]">{errors.name.message}</p>}
        </div>

        {/* CATEGORY (react-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tjänstekategori</label>
          <Controller
            control={control}
            name="category"
            rules={{ required: "Kategori krävs" }}
            render={({ field }) => (
              <Select {...field} options={CATEGORY_OPTIONS} className="mt-1" />
            )}
          />
          {errors.category && <p className="text-sm text-[#E35C67]">{errors.category.message}</p>}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivning</label>
          <textarea
            {...register("description", { required: "Beskrivning krävs" })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows="3"
          />
          {errors.description && <p className="text-sm text-[#E35C67]">{errors.description.message}</p>}
        </div>

        {/* SERVICE LEVEL (react-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service-nivå</label>
          <Controller
            control={control}
            name="serviceLevel"
            rules={{ required: "Service-nivå krävs" }}
            render={({ field }) => (
              <Select {...field} options={SERVICE_LEVEL_OPTIONS} className="mt-1" />
            )}
          />
          {errors.serviceLevel && <p className="text-sm text-[#E35C67]">{errors.serviceLevel.message}</p>}
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pris per månad (SEK)</label>
          <input
            {...register("pricePerMonth", { required: "Pris krävs" })}
            type="number"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* CONTRACT LENGTH */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kontraktslängd (månader)</label>
          <input
            {...register("contractLength", { required: "Kontraktslängd krävs" })}
            type="number"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* RENEWAL PERIOD */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Förnyelseperiod (månader)</label>
          <input
            {...register("renewalPeriod", { required: "Förnyelseperiod krävs" })}
            type="number"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* SUPPORT CONTACT */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Supportkontakt (e-post)</label>
          <input
            {...register("supportContact")}
            type="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* ACTIVE (react-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Select {...field} options={ACTIVE_OPTIONS} className="mt-1" />
            )}
          />
        </div>

        {/* NOTES */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Anteckningar</label>
          <textarea
            {...register("notes")}
            rows="3"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* CREATED AT */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skapad (datum)</label>
          <input
            {...register("createdAt")}
            type="date"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585]"
          >
            Uppdatera abonnemang
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSubscription;
