import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import { subscriptionService } from "../../services/subscriptionService";

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

const fetchSubscription = async (id) => {
  const response = await subscriptionService.getSubscriptionById(id);

  return {
    id: response.id,
    name: response.name,
    category: response.category,
    description: response.description,
    serviceLevel: response.serviceLevel,
    pricePerMonth: response.pricePerMonth,
    contractLength: response.contractLength,
    renewalPeriod: response.renewalPeriod,
    supportContact: response.supportContact,
    createdAt: response.createdAt,
    notes: response.notes,
  };
};

const UpdateSubscription = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [serverError, setServerError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [originalSubscription, setOriginalSubscription] = useState(null);
  const [priceChanged, setPriceChanged] = useState(false);

  const subscriptionFromList = state?.subscription;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({ defaultValues: {} });

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        if (subscriptionFromList) {
          const formatted = formatForForm(subscriptionFromList);
          setOriginalSubscription(subscriptionFromList);
          reset(formatted);
          return;
        }

        const data = await fetchSubscription(id);
        setOriginalSubscription(data);
        reset(formatForForm(data));

      } catch (error) {
        setServerError("Kunde inte hämta abonnemangets information.");
      }
    };

    loadSubscription();
  }, [subscriptionFromList, id, reset]);

  const formatForForm = (data) => ({
    name: data.name,
    category: CATEGORY_OPTIONS.find(c => c.value === data.category),
    description: data.description,
    serviceLevel: SERVICE_LEVEL_OPTIONS.find(s => s.value === data.serviceLevel),
    pricePerMonth: data.pricePerMonth,
    contractLength: data.contractLength,
    renewalPeriod: data.renewalPeriod,
    supportContact: data.supportContact,
    notes: data.notes,
    createdAt: data.createdAt?.substring(0, 10)
  });

  const handlePreSubmit = (data) => {
    setPendingFormData(data);

    if (originalSubscription) {
      const changed =
        Number(data.pricePerMonth) !== Number(originalSubscription.pricePerMonth);
      setPriceChanged(changed);
    }

    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!pendingFormData) return;

    try {
      const data = pendingFormData;

      const dto = {
        name: data.name,
        category: data.category.value,
        description: data.description,
        serviceLevel: data.serviceLevel.value,
        pricePerMonth: Number(data.pricePerMonth),
        contractLength: Number(data.contractLength),
        renewalPeriod: Number(data.renewalPeriod),
        supportContact: data.supportContact,
        notes: data.notes,
        createdAt: data.createdAt,
      };

      await subscriptionService.updateSubscription(id, dto);
      navigate("/subscriptions/list");

    } catch (error) {
      setServerError("Ett fel inträffade vid uppdatering.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">Uppdatera abonnemang</h2>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-300 px-3 py-2 rounded-lg mb-4">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-6">

        {/* NAME */}
        <div>
          <label className="block text-sm">Abonnemangsnamn</label>
          <input
            {...register("name", { required: "Namn krävs" })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm">Tjänstekategori</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Kategori krävs" }}
            render={({ field }) => (
              <Select {...field} options={CATEGORY_OPTIONS} />
            )}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm">Beskrivning</label>
          <textarea
            {...register("description", { required: "Beskrivning krävs" })}
            rows={3}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* SERVICE LEVEL */}
        <div>
          <label className="block text-sm">Service-nivå</label>
          <Controller
            name="serviceLevel"
            control={control}
            rules={{ required: "Service-nivå krävs" }}
            render={({ field }) => (
              <Select {...field} options={SERVICE_LEVEL_OPTIONS} />
            )}
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm">Pris per månad (SEK)</label>
          <input
            {...register("pricePerMonth", { required: "Pris krävs" })}
            type="number"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* CONTRACT LENGTH */}
        <div>
          <label className="block text-sm">Kontraktslängd (månader)</label>
          <input
            {...register("contractLength", { required: "Kontraktslängd krävs" })}
            type="number"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* RENEWAL PERIOD */}
        <div>
          <label className="block text-sm">Förnyelseperiod (månader)</label>
          <input
            {...register("renewalPeriod", { required: "Förnyelseperiod krävs" })}
            type="number"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* SUPPORT CONTACT */}
        <div>
          <label className="block text-sm">Supportkontakt (e-post)</label>
          <input
            {...register("supportContact")}
            type="email"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* NOTES */}
        <div>
          <label className="block text-sm">Anteckningar</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* CREATED AT */}
        <div>
          <label className="block text-sm">Skapad (datum)</label>
          <input
            {...register("createdAt")}
            type="date"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-[#165C6D] text-white rounded-lg">
            Uppdatera abonnemang
          </button>
        </div>
      </form>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow max-w-sm">

            <h3 className="text-xl font-bold text-[#165C6D] mb-4">
              Bekräfta ändringar
            </h3>

            <p className="text-gray-700 mb-6">
              <b>Dessa ändringar påverkar alla kontrakt som är kopplade till detta abonnemang.</b>
              <br /><br />

              {priceChanged ? (
                <p className="text-red-600">
                  Vid prisändring räknas varje kontrakts totalpris om utifrån de nya abonnemangspriserna.
                  Eventuella tidigare prisavvikelser (rabatter eller manuella justeringar)
                  bevaras och läggs på den nya totalsumman.
                </p>
              ) : (
                <p className="text-red-600">
                  Ingen prisändring görs i kopplade kontrakt. Endast abonnemangets information uppdateras.
                </p>
              )}

              <br /><br />
              <b className="text-red-600">Är du säker på att du vill fortsätta?</b>
            </p>

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
