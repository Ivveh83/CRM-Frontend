import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { resellerService } from "../../services/resellerService.js";
import { useState } from "react";

const defaultFormValues = {
  name: "",
  orgNo: "",
  address: "",
  contactEmail: "",
  contactTelephone: "",
  invoiceReference: "",
  createdAt: new Date().toISOString().split("T")[0], // dagens datum
};

const CreateReseller = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const navigate = useNavigate();

  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    try {
      console.log("Skickar data till backend:", data);

      const response = await resellerService.createReseller(data);

      console.log("Återförsäljare skapad:", response);

      reset();

      navigate("/resellers/list");
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#165C6D]">
          Skapa ny återförsäljare
        </h2>

        {serverError && (
          <p className="text-sm text-[#E35C67] bg-red-50 border border-red-300 px-3 py-2 rounded-lg shadow-sm max-w-sm">
            {serverError}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* NAMN */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Företagsnamn
          </label>

          <input
            id="name"
            {...register("name", { required: true })}
            type="text"
            placeholder="Ex. Företag AB"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          {errors.name && (
            <p className="text-sm text-[#E35C67] mt-1">Namn krävs</p>
          )}
        </div>

        {/* ORG NR */}
        <div>
          <label
            htmlFor="orgNo"
            className="block text-sm font-medium text-gray-700"
          >
            Organisationsnummer
          </label>

          <input
            id="orgNo"
            {...register("orgNo", {
              required: "Organisationsnummer krävs",
              pattern: {
                value: /^[A-Za-z0-9\-]{6,20}$/,
                message: "Ogiltigt organisationsnummer (fel format)",
              },
            })}
            type="text"
            placeholder="Ex. 556677-8899"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          {errors.orgNo && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.orgNo.message}
            </p>
          )}
        </div>

        {/* ADRESS */}
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
            placeholder="Ex. Ankeborgsvägen 12"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="contactEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Kontakt-e-post
          </label>

          <input
            id="contactEmail"
            {...register("contactEmail", {
              required: false,
              pattern: /^\S+@\S+\.\S+$/,
            })}
            type="email"
            placeholder="Ex. kontakt@företag.se"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          {errors.contactEmail && (
            <p className="text-sm text-[#E35C67] mt-1">
              Ange en giltig e-postadress
            </p>
          )}
        </div>

        {/* TELEFON */}
        <div>
          <label
            htmlFor="contactTelephone"
            className="block text-sm font-medium text-gray-700"
          >
            Kontakttelefon
          </label>

          <input
            id="contactTelephone"
            {...register("contactTelephone", {
              required: false,
              pattern: /^\+?[0-9\s\-()]{7,20}$/,
            })}
            type="tel"
            placeholder="Ex. +46 70 123 45 67"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          {errors.contactTelephone && (
            <p className="text-sm text-[#E35C67] mt-1">
              Ange ett giltigt telefonnummer
            </p>
          )}
        </div>

        {/* FAKTURAREFERENS */}
        <div>
          <label
            htmlFor="invoiceReference"
            className="block text-sm font-medium text-gray-700"
          >
            Fakturareferens
          </label>

          <input
            id="invoiceReference"
            {...register("invoiceReference")}
            type="text"
            placeholder="Ex. Kundnr 2025-01"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* CREATED AT */}
        <div>
          <label
            htmlFor="createdAt"
            className="block text-sm font-medium text-gray-700"
          >
            Skapad (datum)
          </label>

          <input
            id="createdAt"
            {...register("createdAt")}
            type="date"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a]"
          >
            Registrera återförsäljare
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReseller;
