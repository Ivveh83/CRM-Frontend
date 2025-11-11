import React from "react";
import { useForm } from "react-hook-form";

const defaultFormValues = {
  title: "",
  reseller: "",
  customer: "",
  subscriptionLength: "",
  createDate: "",
  renewalDate: "",
  dueDate: "",
  status: "",
  comment: "",
};

const UpdateContract = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  // 🔹 Läs av datum i realtid
  const createDate = watch("createDate");
  const dueDate = watch("dueDate");

  const onSubmit = (data) => {
    console.log("Uppdaterat kontrakt:", data);
    alert("Kontraktet har uppdaterats!");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Uppdatera kontrakt
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Abonnemang */}
        <div>
          <label
            htmlFor="subscription"
            className="block text-sm font-medium text-gray-700"
          >
            Abonnemang
          </label>
          <select
            id="subscription"
            {...register("subscription")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            <option value="">Välj abonnemang</option>
            <option value="ab1">Abonnemang 1</option>
            <option value="ab2">Abonnemang 2</option>
            <option value="ab3">Abonnemang 3</option>
          </select>
          <button
            type="button"
            className="mt-3 bg-[#E35C67] text-white px-4 py-2 rounded-lg hover:bg-[#1f7585] transition w-full sm:w-auto"
          >
            Skapa nytt abonnemang
          </button>
        </div>

        {/* Reseller och Kund */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="reseller"
              className="block text-sm font-medium text-gray-700"
            >
              Återförsäljare
            </label>
            <select
              id="reseller"
              {...register("reseller")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
            >
              <option value="">Välj återförsäljare</option>
              <option value="reseller1">Reseller 1</option>
              <option value="reseller2">Reseller 2</option>
              <option value="reseller3">Reseller 3</option>
            </select>
            <button
              type="button"
              className="mt-3 bg-[#E35C67] text-white px-4 py-2 rounded-lg hover:bg-[#1f7585] transition w-full sm:w-auto"
            >
              Skapa ny återförsäljare
            </button>
          </div>

          <div>
            <label
              htmlFor="customer"
              className="block text-sm font-medium text-gray-700"
            >
              Kund
            </label>
            <select
              id="customer"
              {...register("customer")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
            >
              <option value="">Välj kund</option>
              <option value="kund1">Kund 1</option>
              <option value="kund2">Kund 2</option>
              <option value="kund3">Kund 3</option>
            </select>
            <button
              type="button"
              className="mt-3 bg-[#E35C67] text-white px-4 py-2 rounded-lg hover:bg-[#1f7585] transition w-full sm:w-auto"
            >
              Skapa ny kund
            </button>
          </div>
        </div>

        {/* Datumfält */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="createDate"
              className="block text-sm font-medium text-gray-700"
            >
              Skapat datum
            </label>
            <input
              type="date"
              id="createDate"
              {...register("createDate", {
                required: "Skapat datum är obligatoriskt",
              })}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.createDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]`}
            />
            {errors.createDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.createDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="renewalDate"
              className="block text-sm font-medium text-gray-700"
            >
              Förnyelsedatum
            </label>
            <input
              type="date"
              id="renewalDate"
              {...register("renewalDate", {
                required: "Förnyelsedatum krävs",
                validate: (value) => {
                  if (!createDate || !dueDate) return true;
                  if (new Date(value) < new Date(createDate))
                    return "Förnyelsedatum kan inte vara före skapat datum";
                  if (new Date(value) > new Date(dueDate))
                    return "Förnyelsedatum måste vara före förfallodatum";
                  return true;
                },
              })}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.renewalDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]`}
            />
            {errors.renewalDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.renewalDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Abonnemangslängd & Förfallodatum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="subscriptionLength"
              className="block text-sm font-medium text-gray-700"
            >
              Abonnemangslängd (månader)
            </label>
            <input
              type="number"
              id="subscriptionLength"
              {...register("subscriptionLength", {
                min: { value: 1, message: "Måste vara minst 1 månad" },
              })}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.subscriptionLength ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]`}
            />
            {errors.subscriptionLength && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subscriptionLength.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Förfallodatum
            </label>
            <input
              type="date"
              id="dueDate"
              {...register("dueDate", {
                required: "Förfallodatum är obligatoriskt",
                validate: (value) => {
                  if (!createDate) return true;
                  if (new Date(value) < new Date(createDate))
                    return "Förfallodatum kan inte vara före skapat datum";
                  return true;
                },
              })}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            <option value="">Välj status</option>
            <option value="closed">Stängd för förnyelse</option>
            <option value="open">Öppen för förnyelse</option>
          </select>
        </div>

        {/* Kommentar */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Kommentar
          </label>
          <textarea
            id="comment"
            {...register("comment")}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            Uppdatera kontrakt
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateContract;
