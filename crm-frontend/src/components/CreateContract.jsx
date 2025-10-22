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

const CreateContract = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const onSubmit = (data) => {
    console.log("Formdata:", data);
    reset();
  };

  return (

        <main className="flex-grow px-8 py-10">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
              Skapa nytt kontrakt
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
                  className="mt-3 bg-[#165C6D] text-white px-4 py-2 rounded-lg hover:bg-[#1f7585] transition w-full sm:w-auto"
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
                    className="mt-3 bg-[#165C6D] text-white px-4 py-2 rounded-lg hover:bg-[#1f7585] transition w-full sm:w-auto"
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
                    className="mt-3 bg-[#165C6D] text-white px-4 py-2 rounded-lg hover:bg-[#1f7585] transition w-full sm:w-auto"
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
                    {...register("createDate")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
                  />
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
                    {...register("renewalDate")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
                  />
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
                    {...register("subscriptionLength")}
                    min="0"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
                  />
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
                    {...register("dueDate")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
                  />
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
                  className="px-6 py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a] focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
                >
                  Registrera kontrakt
                </button>
              </div>
            </form>
          </div>
        </main>
  );
};

export default CreateContract;
