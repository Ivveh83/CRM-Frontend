// AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import NotFound from "../components/fallbacks/NotFound.jsx";

// Contracts
import ContractsDashboard from "../components/contracts/ContractsDashboard.jsx";
import CreateContract from "../components/contracts/CreateContract.jsx";
import ContractsList from "../components/contracts/ContractsList.jsx";
import ContractsHistory from "../components/contracts/ContractHistory.jsx";
import UpdateContract from "../components/contracts/UpdateContract.jsx";

// Customers
import CreateCustomer from "../components/customers/CreateCustomer.jsx";
import UpdateCustomer from "../components/customers/UpdateCustomer.jsx";
import CustomerInfo from "../components/customers/CustomerInfo.jsx";

// Resellers
import CreateReseller from "../components/resellers/CreateReseller.jsx";
import UpdateReseller from "../components/resellers/UpdateReseller.jsx";

// Subscriptions
import CreateSubscription from "../components/subscriptions/CreateSubscription.jsx";
import UpdateSubscription from "../components/subscriptions/UpdateSubscription.jsx";
import SubscriptionsList from "../components/subscriptions/SubscriptionsList.jsx";

// Welcome Page
import WelcomePage from "../components/WelcomePage.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      {/* Startpage */}
      <Route path="home" element={<WelcomePage />} />

      {/* Contracts */}
      <Route path="contracts">
        <Route path="dashboard" element={<ContractsDashboard />} />
        <Route path="list" element={<ContractsList />} />
        <Route path="create" element={<CreateContract />} />
        <Route path="history" element={<ContractsHistory />} />
        <Route path="update/:id" element={<UpdateContract />} />
      </Route>

      {/* Customers */}
      <Route path="customers">
        <Route path="create" element={<CreateCustomer />} />
        <Route path="update/:id" element={<UpdateCustomer />} />
        <Route path=":id" element={<CustomerInfo />} />
      </Route>

      {/* Resellers */}
      <Route path="resellers">
        <Route path="create" element={<CreateReseller />} />
        <Route path="update/:id" element={<UpdateReseller />} />
      </Route>

      {/* Subscriptions */}
      <Route path="subscriptions">
        <Route path="list" element={<SubscriptionsList />} />
        <Route path="create" element={<CreateSubscription />} />
        <Route path="update/:id" element={<UpdateSubscription />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
