// AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import NotFound from "../components/fallbacks/NotFound.jsx";
import RequireAuth from "../components/auth/RequireAuth.jsx";

// Contracts
import ContractsDashboard from "../components/contracts/ContractsDashboard.jsx";
import CreateContract from "../components/contracts/CreateContract.jsx";
import ContractsList from "../components/contracts/ContractsList.jsx";
import ContractHistory from "../components/contracts/ContractHistory.jsx";
import UpdateContract from "../components/contracts/UpdateContract.jsx";
import ContractInfo from "../components/contracts/ContractInfo.jsx";

// Customers
import CreateCustomer from "../components/customers/CreateCustomer.jsx";
import UpdateCustomer from "../components/customers/UpdateCustomer.jsx";
import CustomerList from "../components/customers/CustomerList.jsx";
import CustomerInfo from "../components/customers/CustomerInfo.jsx";
import CustomerHistory from "../components/customers/CustomerHistory.jsx";

// Resellers
import CreateReseller from "../components/resellers/CreateReseller.jsx";
import UpdateReseller from "../components/resellers/UpdateReseller.jsx";
import ResellerList from "../components/resellers/ResellerList.jsx";
import ResellerInfo from "../components/resellers/ResellerInfo.jsx";
import ResellerHistory from "../components/resellers/ResellerHistory.jsx";

// Subscriptions
import CreateSubscription from "../components/subscriptions/CreateSubscription.jsx";
import UpdateSubscription from "../components/subscriptions/UpdateSubscription.jsx";
import SubscriptionsList from "../components/subscriptions/SubscriptionsList.jsx";
import SubscriptionInfo from "../components/subscriptions/SubscriptionInfo.jsx";
import SubscriptionHistory from "../components/subscriptions/SubscriptionHistory.jsx";

// Welcome Page & Settings
import WelcomePage from "../components/WelcomePage.jsx";
import ChangePassword from "../components/settings/ChangePassword.jsx";
import LookupManager from "../components/lookups/LookupManager.jsx";
import AdminUserManager from "../components/settings/AdminUserManager.jsx";

// Auth
import Login from "../components/login&register/Login.jsx";
import Register from "../components/login&register/Register.jsx";

// Fallbacks
import Unauthorized from "../components/fallbacks/Unauthorized.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* PUBLIC ROUTES */}
    <Route element={<PublicLayout />}>
      {/* Login */}
      <Route path="login" element={<Login />} />

      {/* Register */}
      <Route path="register" element={<Register />} />

      <Route path="unauthorized" element={<Unauthorized />} />
    </Route>

    {/* PROTECTED ROUTES */}
    <Route element={<RequireAuth allowedRoles={["ROLE_ADMIN"]} />}>
      <Route element={<MainLayout />}>
        {/* Startpage */}
        <Route path="home" element={<WelcomePage />} />

        {/* Contracts */}
        <Route path="contracts">
          <Route path="dashboard" element={<ContractsDashboard />} />
          <Route path="list" element={<ContractsList />} />
          <Route path="create" element={<CreateContract />} />
          <Route path=":id/history" element={<ContractHistory />} />
          <Route path=":id" element={<ContractInfo />} />
          <Route path="update/:contractId" element={<UpdateContract />} />
        </Route>

        {/* Customers */}
        <Route path="customers">
          <Route path="create" element={<CreateCustomer />} />
          <Route path="list" element={<CustomerList />} />
          <Route path="update/:id" element={<UpdateCustomer />} />
          <Route path=":id" element={<CustomerInfo />} />
          <Route path=":id/history" element={<CustomerHistory />} />
        </Route>

        {/* Resellers */}
        <Route path="resellers">
          <Route path="create" element={<CreateReseller />} />
          <Route path="list" element={<ResellerList />} />
          <Route path="update/:id" element={<UpdateReseller />} />
          <Route path=":id" element={<ResellerInfo />} />
          <Route path=":id/history" element={<ResellerHistory />} />
        </Route>

        {/* Subscriptions */}
        <Route path="subscriptions">
          <Route path="list" element={<SubscriptionsList />} />
          <Route path="create" element={<CreateSubscription />} />
          <Route path="update/:id" element={<UpdateSubscription />} />
          <Route path=":id" element={<SubscriptionInfo />} />
          <Route path=":id/history" element={<SubscriptionHistory />} />
        </Route>

        {/* Settings */}
        <Route path="settings">
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="dropdown-settings" element={<LookupManager />} />
          <Route path="user-management" element={<AdminUserManager />} />
        </Route>

        {/* Fallbacks */}
        <Route path="*" element={<NotFound />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
