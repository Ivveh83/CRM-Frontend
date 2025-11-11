import React from "react";
import { useForm } from "react-hook-form";

const defaultFormValues = {
  company_name: "",
  org_no: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  city: "",
  zip_code: "",
  country: "",
  industry: "",
  customer_type: "",
  created_at: new Date().toISOString().split("T")[0],
  notes: "",
};

const UpdateCustomer = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const onSubmit = (data) => {
    console.log("Uppdaterad kund:", data);
    alert(`Kunden "${data.company_name}" har uppdaterats!`);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">Uppdatera kund</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Företagsnamn */}
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
            Företagsnamn
          </label>
          <input
            id="company_name"
            {...register("company_name", { required: "Företagsnamn krävs" })}
            type="text"
            placeholder="Ex. Företag AB"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.company_name && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.company_name.message}</p>
          )}
        </div>

        {/* Organisationsnummer */}
        <div>
          <label htmlFor="org_no" className="block text-sm font-medium text-gray-700">
            Organisationsnummer
          </label>
          <input
            id="org_no"
            {...register("org_no", {
              required: "Organisationsnummer krävs",
              pattern: {
                value: /^\d{6,10}[-]?\d{4}$/,
                message: "Ogiltigt organisationsnummerformat",
              },
            })}
            type="text"
            placeholder="Ex. 556677-8899"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.org_no && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.org_no.message}</p>
          )}
        </div>

        {/* Kontaktperson */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
              Kontaktperson
            </label>
            <input
              id="contact_name"
              {...register("contact_name", { required: "Kontaktperson krävs" })}
              type="text"
              placeholder="Ex. Anna Karlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.contact_name && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.contact_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
              Kontakt-e-post
            </label>
            <input
              id="contact_email"
              {...register("contact_email", {
                required: "E-post krävs",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Ogiltig e-postadress",
                },
              })}
              type="email"
              placeholder="Ex. anna.karlsson@företag.se"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.contact_email && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.contact_email.message}</p>
            )}
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
            Kontakttelefon
          </label>
          <input
            id="contact_phone"
            {...register("contact_phone", {
              required: "Telefonnummer krävs",
              pattern: {
                value: /^\+?[0-9\s\-()]{7,20}$/,
                message: "Ogiltigt internationellt telefonnummer",
              },
            })}
            type="tel"
            placeholder="Ex. +46 70 123 45 67"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.contact_phone && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.contact_phone.message}</p>
          )}
        </div>

        {/* Adress */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adress
          </label>
          <input
            id="address"
            {...register("address", { required: "Adress krävs" })}
            type="text"
            placeholder="Ex. Storgatan 12"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.address && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Ort, postnummer, land */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
              Postnummer
            </label>
            <input
              id="zip_code"
              {...register("zip_code", { required: "Postnummer krävs" })}
              type="text"
              placeholder="123 45"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.zip_code && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.zip_code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Stad
            </label>
            <input
              id="city"
              {...register("city", { required: "Stad krävs" })}
              type="text"
              placeholder="Ex. Stockholm"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.city && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Land
            </label>
            <input
              id="country"
              {...register("country", { required: "Land krävs" })}
              type="text"
              placeholder="Ex. Sverige"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.country && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>

        {/* Bransch och kundtyp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Bransch
            </label>
            <input
              id="industry"
              {...register("industry")}
              type="text"
              placeholder="Ex. IT, Energi, Transport"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="customer_type" className="block text-sm font-medium text-gray-700">
              Kundtyp
            </label>
            <select
              id="customer_type"
              {...register("customer_type", { required: "Välj kundtyp" })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            >
              <option value="">Välj kundtyp</option>
              <option value="business">Företagskund</option>
              <option value="private">Privatkund</option>
              <option value="partner">Partner</option>
            </select>
            {errors.customer_type && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.customer_type.message}</p>
            )}
          </div>
        </div>

        {/* Anteckningar */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Anteckningar
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            rows="4"
            placeholder="Ex. Viktig kund, kontaktas varje kvartal..."
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
            Uppdatera kund
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;
