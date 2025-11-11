import React from "react";
import { useForm } from "react-hook-form";

const UpdateReseller = ({ resellerData = {} }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: resellerData,
  });

  const onSubmit = (data) => {
    console.log("Uppdaterad återförsäljare:", data);
    reset(data);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera återförsäljare
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Namn */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Företagsnamn
          </label>
          <input
            id="name"
            {...register("name", { required: "Företagsnamn krävs" })}
            type="text"
            placeholder="Ex. Företag AB"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.name && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Organisationsnummer */}
        <div>
          <label
            htmlFor="org_no"
            className="block text-sm font-medium text-gray-700"
          >
            Organisationsnummer
          </label>
          <input
            id="org_no"
            {...register("org_no", {
              required: "Organisationsnummer krävs",
              pattern: {
                value: /^\d{6,10}[-]?\d{4}$/,
                message: "Ogiltigt format (t.ex. 556677-8899)",
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

        {/* Adress */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Adress
          </label>
          <input
            id="address"
            {...register("address")}
            type="text"
            placeholder="Ex. Ankeborgsvägen 12, 123 45 Ankeborg"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Kontaktmail */}
        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium text-gray-700"
          >
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
            placeholder="Ex. kontakt@företag.se"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
          {errors.contact_email && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.contact_email.message}
            </p>
          )}
        </div>

        {/* Kontakttelefon */}
        <div>
          <label
            htmlFor="contact_phone"
            className="block text-sm font-medium text-gray-700"
          >
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
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.contact_phone.message}
            </p>
          )}
        </div>

        {/* Fakturareferens */}
        <div>
          <label
            htmlFor="invoice_reference"
            className="block text-sm font-medium text-gray-700"
          >
            Fakturareferens
          </label>
          <input
            id="invoice_reference"
            {...register("invoice_reference")}
            type="text"
            placeholder="Ex. Kundnummer 1234"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Skapat datum */}
        <div>
          <label
            htmlFor="created_at"
            className="block text-sm font-medium text-gray-700"
          >
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
            Uppdatera återförsäljare
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateReseller;
