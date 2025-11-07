import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";

import ContractsDashboard from "../components/ContractsDashboard";
import CreateContract from "../components/CreateContract";
import NotFound from "../components/NotFound";
import ContractsList from "../components/ContractsList";
import SubscriptionsList from "../components/SubscriptionsList";
import CreateReseller from "../components/CreateReseller";
import CreateCustomer from "../components/CreateCustomer";
import CreateSubscription from "../components/CreateSubscription";
import ContractsHistory from "../components/ContractsHistory.jsx";
import UpdateContract from "../components/UpdateContract.jsx";
import UpdateCustomer from "../components/UpdateCustomer.jsx";
import UpdateReseller from "../components/UpdateReseller.jsx";
import UpdateSubscription from "../components/UpdateSubscription.jsx";


const AppRoutes = () => {
  return (
    <Routes>
      {/* 📦 Layout blir “parent route” som omsluter allt */}
      <Route path="/" element={<Layout />}>
        {/* ⬇️ Barnroutes — dessa renderas i <Outlet /> i Layout */}

        <Route index element={<ContractsDashboard />} />
        <Route path="contracts-dashboard" element={<ContractsDashboard />} />
        <Route path="create-contract" element={<CreateContract />} />
        <Route path="create-reseller" element={<CreateReseller />} />
        <Route path="create-customer" element={<CreateCustomer />} />
        <Route path="create-subscription" element={<CreateSubscription />} />
        <Route path="contracts-list" element={<ContractsList />} />
        <Route path="subscriptions-list" element={<SubscriptionsList />} />
        <Route path="contracts-history" element={<ContractsHistory />} />
        <Route path="update-contract" element={<UpdateContract />} />
        <Route path="update-customer" element={<UpdateCustomer />} />
        <Route path="update-reseller" element={<UpdateReseller />} />
        <Route path="update-subscription" element={<UpdateSubscription />} />
        

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
