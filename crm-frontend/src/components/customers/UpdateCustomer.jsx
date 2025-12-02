import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";

const defaultFormValues = {
  companyName: "",
  orgNo: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  city: "",
  zipCode: "",
  country: "",
  industry: "",
  customerType: "",
  createdAt: new Date().toISOString().split("T")[0],
  notes: "",
};

const UpdateCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  // 🔵 Hämta kunddata
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id);

        reset({
          ...data,
          createdAt: data.createdAt?.substring(0, 10),
        });
      } catch (err) {
        console.error("Kunde inte hämta kund:", err);
        setServerError("Kunde inte hämta kundinformation.");
      }
    };

    fetchCustomer();
  }, [id, reset]);

  // 🔧 Uppdatera kund
  const onSubmit = async (data) => {
    try {
      await customerService.updateCustomer(id, data);
      navigate("/customers/list");
    } catch (err) {
      console.error("Fel vid uppdatering:", err);

      const backendErrors = err?.response?.data?.errors;

      // Backend skickar array av strängar
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setServerError(backendErrors.join(", "));
        return;
      }

      setServerError(
        err?.response?.data?.message ||
          err?.message ||
          "Ett oväntat fel uppstod"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">

      {/* 🌟 Globala backend-fel */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {serverError}
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">Uppdatera kund</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Företagsnamn */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Företagsnamn
          </label>
          <input
            id="companyName"
            {...register("companyName", { required: "Företagsnamn krävs" })}
            type="text"
            placeholder="Ex. Företag AB"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.companyName && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.companyName.message}</p>
          )}
        </div>

        {/* Organisationsnummer */}
        <div>
          <label htmlFor="orgNo" className="block text-sm font-medium text-gray-700">
            Organisationsnummer
          </label>
          <input
            id="orgNo"
            {...register("orgNo", {
              required: "Organisationsnummer krävs",
              pattern: {
                value: /^\d{6,10}[-]?\d{4}$/,
                message: "Ogiltigt organisationsnummerformat",
              },
            })}
            type="text"
            placeholder="Ex. 556677-8899"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.orgNo && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.orgNo.message}</p>
          )}
        </div>

        {/* Kontaktperson */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
              Kontaktperson
            </label>
            <input
              id="contactName"
              {...register("contactName")}
              type="text"
              placeholder="Ex. Anna Karlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Kontakt-e-post
            </label>
            <input
              id="contactEmail"
              {...register("contactEmail", {
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Ogiltig e-postadress",
                },
              })}
              type="email"
              placeholder="Ex. anna.karlsson@foretag.se"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.contactEmail && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
            Kontakttelefon
          </label>
          <input
            id="contactPhone"
            {...register("contactPhone")}
            type="tel"
            placeholder="Ex. +46 70 123 45 67"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Adress */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adress
          </label>
          <input
            id="address"
            {...register("address")}
            type="text"
            placeholder="Ex. Storgatan 12"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Ort, postnummer, land */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Postnummer
            </label>
            <input
              id="zipCode"
              {...register("zipCode")}
              type="text"
              placeholder="123 45"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Stad
            </label>
            <input
              id="city"
              {...register("city")}
              type="text"
              placeholder="Ex. Stockholm"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Land
            </label>
            <input
              id="country"
              {...register("country")}
              type="text"
              placeholder="Ex. Sverige"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
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
            <label htmlFor="customerType" className="block text-sm font-medium text-gray-700">
              Kundtyp
            </label>
            <select
              id="customerType"
              {...register("customerType")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            >
              <option value="">Välj kundtyp</option>
              <option value="business">Företagskund</option>
              <option value="private">Privatkund</option>
              <option value="partner">Partner</option>
            </select>
            {errors.customerType && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.customerType.message}</p>
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
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
            Skapad (datum)
          </label>
          <input
            id="createdAt"
            {...register("createdAt")}
            type="date"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow"
          >
            Uppdatera kund
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;