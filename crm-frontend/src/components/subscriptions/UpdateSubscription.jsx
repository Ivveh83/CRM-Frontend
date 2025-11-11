import React from "react";
import { useForm } from "react-hook-form";

const UpdateSubscription = ({ subscriptionData = {} }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: subscriptionData,
  });

  const onSubmit = (data) => {
    console.log("Uppdaterat abonnemang:", data);
    reset(data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera abonnemang
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Namn */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Abonnemangsnamn
          </label>
          <input
            id="name"
            {...register("name", { required: "Namn krävs" })}
            type="text"
            placeholder="Ex. Threat Monitoring Basic"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.name && <p className="text-sm text-[#E35C67] mt-1">{errors.name.message}</p>}
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Tjänstekategori
          </label>
          <select
            id="category"
            {...register("category", { required: "Välj en kategori" })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          >
            <option value="">Välj kategori</option>
            <option value="threat_monitoring">Threat Monitoring</option>
            <option value="penetration_testing">Penetration Testing</option>
            <option value="vulnerability_management">Vulnerability Management</option>
            <option value="incident_response">Incident Response</option>
            <option value="soc_service">SOC-as-a-Service</option>
            <option value="endpoint_protection">Endpoint Protection</option>
            <option value="training">Security Awareness Training</option>
          </select>
          {errors.category && <p className="text-sm text-[#E35C67] mt-1">{errors.category.message}</p>}
        </div>

        {/* Beskrivning */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Beskrivning
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Beskrivning krävs" })}
            rows="3"
            placeholder="Kort beskrivning av tjänsten..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.description && <p className="text-sm text-[#E35C67] mt-1">{errors.description.message}</p>}
        </div>

        {/* Service Level */}
        <div>
          <label htmlFor="service_level" className="block text-sm font-medium text-gray-700">
            Service-nivå (SLA)
          </label>
          <select
            id="service_level"
            {...register("service_level", { required: "Välj service-nivå" })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          >
            <option value="">Välj SLA-nivå</option>
            <option value="bronze">Bronze (kontorstid)</option>
            <option value="silver">Silver (12/5 support)</option>
            <option value="gold">Gold (24/7 support)</option>
            <option value="platinum">Platinum (dedikerad SOC)</option>
          </select>
          {errors.service_level && <p className="text-sm text-[#E35C67] mt-1">{errors.service_level.message}</p>}
        </div>

        {/* Pris per månad */}
        <div>
          <label htmlFor="price_per_month" className="block text-sm font-medium text-gray-700">
            Pris per månad (SEK)
          </label>
          <input
            id="price_per_month"
            {...register("price_per_month", {
              required: "Pris krävs",
              pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Ange ett giltigt belopp" },
            })}
            type="text"
            placeholder="Ex. 2999"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.price_per_month && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.price_per_month.message}</p>
          )}
        </div>

        {/* Kontraktslängd */}
        <div>
          <label htmlFor="contract_length" className="block text-sm font-medium text-gray-700">
            Kontraktslängd (månader)
          </label>
          <input
            id="contract_length"
            min="0"
            {...register("contract_length", {
              required: "Kontraktslängd krävs",
              min: { value: 1, message: "Minst 1 månad" },
            })}
            type="number"
            placeholder="Ex. 12"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.contract_length && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.contract_length.message}</p>
          )}
        </div>

        {/* Förnyelseperiod */}
        <div>
          <label htmlFor="renewal_period" className="block text-sm font-medium text-gray-700">
            Förnyelseperiod (månader)
          </label>
          <input
            id="renewal_period"
            min="0"
            {...register("renewal_period", {
              required: "Förnyelseperiod krävs",
              min: { value: 1, message: "Minst 1 månad" },
            })}
            type="number"
            placeholder="Ex. 12"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.renewal_period && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.renewal_period.message}</p>
          )}
        </div>

        {/* Supportkontakt */}
        <div>
          <label htmlFor="support_contact" className="block text-sm font-medium text-gray-700">
            Supportkontakt (e-post)
          </label>
          <input
            id="support_contact"
            {...register("support_contact", {
              required: "Supportkontakt krävs",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Ogiltig e-postadress" },
            })}
            type="email"
            placeholder="Ex. support@foretag.se"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.support_contact && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.support_contact.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="active" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="active"
            {...register("active")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          >
            <option value={true}>Aktivt</option>
            <option value={false}>Inaktivt</option>
          </select>
        </div>

        {/* Anteckningar */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Anteckningar
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows="3"
            placeholder="Ex. Anpassad lösning för större kunder..."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Skapad datum */}
        <div>
          <label htmlFor="created_at" className="block text-sm font-medium text-gray-700">
            Skapad (datum)
          </label>
          <input
            id="created_at"
            {...register("created_at")}
            type="date"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            Uppdatera abonnemang
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSubscription;
