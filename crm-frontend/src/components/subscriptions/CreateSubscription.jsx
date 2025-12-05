import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { subscriptionService } from "../../services/subscriptionService.js";
import { useLookup } from "../../hooks/useLookup.jsx";

const defaultFormValues = {
  name: "",
  description: "",
  category: "",
  serviceLevel: "",
  pricePerMonth: "",
  contractLength: "",
  renewalPeriod: "",
  active: true,
  supportContact: "",
  createdAt: new Date().toISOString().split("T")[0],
  notes: "",
};

const CreateSubscription = () => {
  const [serverError, setServerError] = useState(null);

  const { options: categoryOptions } = useLookup("subscription_category", true);
  const { options: levelOptions } = useLookup("service_level", true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (data) => {
    try {
      setServerError(null);

      // Konvertera sträng → bool om det behövs (react-hook-form gör dem till strängar)
      const payload = {
        ...data,
        active: data.active === "true" || data.active === true,
      };

      await subscriptionService.createSubscription(payload);

      alert("Abonnemang skapat!");
      reset(defaultFormValues);
    } catch (error) {
      const backendMessage =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Ett oväntat fel uppstod";

      setServerError(backendMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Skapa nytt abonnemang
      </h2>

      {serverError && (
        <p className="mb-4 px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-[#E35C67]">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Namn */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Abonnemangsnamn
          </label>
          <input
            {...register("name", { required: "Namn krävs" })}
            type="text"
            placeholder="Ex. Threat Monitoring Basic"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.name && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tjänstekategori
          </label>
          <select
            {...register("category")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Välj kategori</option>
            {categoryOptions.map((opt) => (
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

        {/* Beskrivning */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Beskrivning
          </label>
          <textarea
            {...register("description")}
            rows="3"
            placeholder="Kort beskrivning av tjänsten..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.description && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Service Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service-nivå (SLA)
          </label>
          <select
            {...register("serviceLevel")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Välj nivå</option>
            {levelOptions.map((opt) => (
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

        {/* Pris per månad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pris per månad (SEK)
          </label>
          <input
            {...register("pricePerMonth", {
              required: "Pris krävs",
              pattern: {
                value: /^[0-9]+$/,
                message: "Ange ett giltigt belopp",
              },
            })}
            type="text"
            placeholder="Ex. 2999"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.pricePerMonth && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.pricePerMonth.message}
            </p>
          )}
        </div>

        {/* Kontraktslängd */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kontraktslängd (månader)
          </label>
          <input
            {...register("contractLength", {
              required: "Kontraktslängd krävs",
              min: { value: 1, message: "Minst 1 månad" },
            })}
            type="number"
            placeholder="Ex. 12"
            min="1"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.contractLength && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.contractLength.message}
            </p>
          )}
        </div>

        {/* Förnyelseperiod */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Förnyelseperiod (månader)
          </label>
          <input
            {...register("renewalPeriod", {
              required: false,
              min: { value: 1, message: "Minst 1 månad" },
            })}
            type="number"
            placeholder="Ex. 12"
            min="1"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.renewalPeriod && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.renewalPeriod.message}
            </p>
          )}
        </div>

        {/* Supportkontakt */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supportkontakt (e-post)
          </label>
          <input
            {...register("supportContact", {
              required: false,
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Ogiltig e-postadress",
              },
            })}
            type="email"
            placeholder="Ex. support@foretag.se"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.supportContact && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.supportContact.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("active")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="true">Aktivt</option>
            <option value="false">Inaktivt</option>
          </select>
        </div>

        {/* Anteckningar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Anteckningar
          </label>
          <textarea
            {...register("notes")}
            rows="3"
            placeholder="Ex. Anpassat för större kunder..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Skapad datum */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skapad (datum)
          </label>
          <input
            {...register("createdAt")}
            type="date"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a]"
          >
            Registrera abonnemang
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubscription;
