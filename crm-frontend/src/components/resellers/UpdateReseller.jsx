import { useForm } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { resellerService } from "../../services/resellerService.js";
import { useState, useEffect } from "react";

const UpdateReseller = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  // Om du navigerar från listan finns reseller med i state
  const resellerFromList = state?.reseller;

  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // 🔥 Hämta återförsäljare från state eller API
  useEffect(() => {
    const loadReseller = async () => {
      try {
        // ✔ Fall 1: Data skickades med via navigate()
        if (resellerFromList) {
          reset({
            name: resellerFromList.name,
            orgNo: resellerFromList.orgNo,
            address: resellerFromList.address,
            contactEmail: resellerFromList.contactEmail,
            contactTelephone: resellerFromList.contactTelephone,
            invoiceReference: resellerFromList.invoiceReference,
            createdAt: resellerFromList.createdAt?.substring(0, 10),
          });
          return;
        }

        // ✔ Fall 2: Hämta via API om state är null
        const data = await resellerService.getResellerById(id);

        reset({
          name: data.name,
          orgNo: data.orgNo,
          address: data.address,
          contactEmail: data.contactEmail,
          contactTelephone: data.contactTelephone,
          invoiceReference: data.invoiceReference,
          createdAt: data.createdAt?.substring(0, 10),
        });

      } catch (error) {
        console.error("Kunde inte ladda återförsäljare:", error);
        setServerError("Kunde inte ladda återförsäljaren.");
      }
    };

    loadReseller();
  }, [id, resellerFromList, reset]);

  // 🔥 SUBMIT LOGIK
  const onSubmit = async (data) => {
    try {
      setServerError(null);

      await resellerService.updateReseller(id, data);

      navigate("/resellers/list");
    } catch (error) {
      console.error("Update-fel:", error);

      const backendMessage =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Ett oväntat fel uppstod";

      setServerError(backendMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      
      {/* HEADER + ERROR */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#165C6D]">
          Uppdatera återförsäljare
        </h2>

        {serverError && (
          <p className="text-sm text-[#E35C67] bg-red-50 border border-red-300 px-3 py-2 rounded-lg shadow-sm max-w-sm">
            {serverError}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Företagsnamn
          </label>
          <input
            {...register("name", { required: "Företagsnamn krävs" })}
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.name && (
            <p className="text-sm text-[#E35C67] mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* ORG NO */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organisationsnummer
          </label>
          <input
            {...register("orgNo", {
              required: "Organisationsnummer krävs",
              pattern: {
                value: /^[A-Za-z0-9\-]{6,20}$/,
                message:
                  "Ogiltigt organisationsnummer – använd t.ex. 556677-8899",
              },
            })}
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.orgNo && (
            <p className="text-sm text-[#E35C67] mt-1">
              {errors.orgNo.message}
            </p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adress
          </label>
          <input
            {...register("address")}
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kontakt-e-post
          </label>
          <input
            {...register("contactEmail", {
              pattern: /^\S+@\S+\.\S+$/,
            })}
            type="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.contactEmail && (
            <p className="text-sm text-[#E35C67] mt-1">
              Ange en giltig e-postadress
            </p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kontakttelefon
          </label>
          <input
            {...register("contactTelephone", {
              pattern: /^\+?[0-9\s\-()]{7,20}$/,
            })}
            type="tel"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {errors.contactTelephone && (
            <p className="text-sm text-[#E35C67] mt-1">
              Ange ett giltigt telefonnummer
            </p>
          )}
        </div>

        {/* INVOICE REF */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fakturareferens
          </label>
          <input
            {...register("invoiceReference")}
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* CREATED AT */}
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

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585]"
          >
            Uppdatera återförsäljare
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateReseller;
