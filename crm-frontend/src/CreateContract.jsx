import Footer from "./Footer";
import Header from "./Header";
import { useForm }  from "react-hook-form";
import Sidebar from "./Sidebar";


        /*
        Namn (på tjänsten)
        Reseller namn
        Kundnamn
        Kontrakt datum (skapat)
        Abonnemangslängd
        Förnyelse datum
        Status: Öppen för förnyelse/Icke Öppen för förnyelse)
        Kommentar (t.ex. ”krånglig kund”, ”tar lång tid att förnya” etc.)
        */
  const defaultFormValues = {
    title: "",
    reseller: "",
    customer: "",
    subscriptionLenght: "",
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
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: defaultFormValues,
  });

  return(
    <>
    <Header />
     {/* Flex-container som fyller hela höjden */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
    <div class="max-w-4xl mx-auto p-6 bg-[#FFFEF6] rounded-xl shadow-lg">
  <h2 class="text-2xl font-semibold text-[#4C4830] mb-6">Skapa nytt kontrakt</h2>
  <form class="space-y-6">
      <div>
    <label for="subscription" class="block text-sm font-medium text-[#4C4830]">Abonnemang</label>
    <select
      id="subscription"
      name="subscription"
      class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4C4830]"
    >
      <option value="">Välj abonnemang</option>
      <option value="kund1">Abonnemang 1</option>
      <option value="kund2">Abonnemang 2</option>
      <option value="kund3">Abonnemang 3</option>
    </select>
    <button class="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-400 transition-colors">Skapa ny</button>
  </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label for="reseller" class="block text-sm font-medium text-[#4C4830]">Reseller namn</label>
    <select
      id="reseller"
      name="reseller"
      class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4C4830]"
    >
      <option value="">Välj reseller</option>
      <option value="reseller1">Reseller 1</option>
      <option value="reseller2">Reseller 2</option>
      <option value="reseller3">Reseller 3</option>
    </select>
    <button class="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-400 transition-colors">Skapa ny</button>
  </div>
  <div>
    <label for="customer" class="block text-sm font-medium text-[#4C4830]">Kundnamn</label>
    <select
      id="customer"
      name="customer"
      class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4C4830]"
    >
      <option value="">Välj kund</option>
      <option value="kund1">Kund 1</option>
      <option value="kund2">Kund 2</option>
      <option value="kund3">Kund 3</option>
    </select>
    <button class="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-400 transition-colors">Skapa ny</button>
  </div>
</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="createDate" class="block text-sm font-medium text-[#4C4830]">Kontraktsdatum</label>
        <input type="date" id="createDate" name="createDate" class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4C4830]" />
      </div>
      <div>
        <label for="renewalDate" class="block text-sm font-medium text-[#4C4830]">Förnyelsedatum</label>
        <input type="date" id="renewalDate" name="renewalDate" class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4C4830]" />
      </div>
    </div>
    <div>
      <label for="subscriptionLenght" class="block text-sm font-medium text-[#4C4830]">Abonnemangslängd (månader)</label>
      <input type="number" id="subscriptionLenght" name="subscriptionLenght" min="0" class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4C4830]" />
    </div>
    <div>
      <label for="dueDate" class="block text-sm font-medium text-[#4C4830]">Förfallodatum</label>
      <input type="date" id="dueDate" name="dueDate" class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4C4830]" />
    </div>
    <div>
      <label for="status" class="block text-sm font-medium text-[#4C4830]">Status</label>
      <select id="status" name="status" class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4C4830]">
        <option value="closed">Icke öppen för förnyelse</option>
        <option value="open">Öppen för förnyelse</option>
      </select>
    </div>
    <div>
      <label for="comment" class="block text-sm font-medium text-[#4C4830]">Kommentar</label>
      <textarea id="comment" name="comment" rows="4" class="mt-1 block w-full px-4 py-2 border border-[#89835B] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4C4830]"></textarea>
    </div>
    <div class="flex justify-end">
      <button type="submit" class="px-6 py-2 bg-[#4C4830] text-white font-semibold rounded-md shadow-md hover:bg-[#89835B] focus:outline-none focus:ring-2 focus:ring-[#4C4830]">
        Registrera
      </button>
    </div>
  </form>
</div>
</div>
<Footer />
    </>
  );
  

}

export default CreateContract;