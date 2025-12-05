import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";
import { useLookup } from "../../hooks/useLookup";

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

  const [serverError, setServerError] = useState("");
  const [loadedCustomer, setLoadedCustomer] = useState(null);

  // 🔵 HÄMTA lookup-värden
  // CreateCustomer använder bara aktiva (true),
  // men här vill vi också börja med aktiva
  // och sedan komplettera med "(Inaktiv)" vid behov.
  const { options: industryOptions } = useLookup("industry", true);
  const { options: typeOptions } = useLookup("customer_type", true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  // 🔵 Hämta kund vid start
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id);
        setLoadedCustomer(data);

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

  // 🔄 Samma helper som i UpdateSubscription
  // Lägger till "(Inaktiv)"-val om det nuvarande värdet inte längre finns bland aktiva.
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

  // Vänta tills kunddata är hämtad
  if (!loadedCustomer) {
    return <div className="p-6 text-gray-600">Laddar kunddata...</div>;
  }

  // Bygg listor med ev. "(Inaktiv)"-post
  const industryList = mergedDropdown(industryOptions, loadedCustomer.industry);
  const typeList = mergedDropdown(typeOptions, loadedCustomer.customerType);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      {serverError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {serverError}
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera kund
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Företagsnamn */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Företagsnamn
          </label>
          <input
            {...register("companyName", { required: "Företagsnamn krävs" })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.companyName && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* Organisationsnummer */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organisationsnummer
          </label>
          <input
            {...register("orgNo", {
              required: "Organisationsnummer krävs",
              pattern: {
                value: /^\d{6,10}[-]?\d{4}$/,
                message: "Ogiltigt organisationsnummerformat",
              },
            })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.orgNo && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.orgNo.message}
            </p>
          )}
        </div>

        {/* Kontaktinfo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kontaktperson
            </label>
            <input
              {...register("contactName")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kontakt-e-post
            </label>
            <input
              {...register("contactEmail")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Adress */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adress
          </label>
          <input
            {...register("address")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Ort / Postnummer / Land */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
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

        {/* Bransch & Kundtyp – dynamiska dropdowns med "(Inaktiv)"-stöd */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bransch */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bransch
            </label>
            <select
              {...register("industry")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Välj bransch</option>
              {industryList.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kundtyp */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kundtyp
            </label>
            <select
              {...register("customerType")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Välj kundtyp</option>
              {typeList.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Anteckningar */}
        <textarea
          {...register("notes")}
          rows="4"
          placeholder="Anteckningar…"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
        />

        {/* Datum */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skapad (datum)
          </label>
          <input
            type="date"
            {...register("createdAt")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
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
