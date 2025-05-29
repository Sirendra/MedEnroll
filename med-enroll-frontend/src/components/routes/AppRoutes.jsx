import { Routes, Route, Navigate } from "react-router-dom";
import CustomerPage from "../../features/customer/pages/CustomerPage";
import CustomerListPage from "../../features/customer/pages/CustomerListPage";
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import Dashboard from "../../features/dashboard/pages/Dashboard";

const AppRoutes = () => {
  const ROUTES = {
    DASHBOARD: "/dashboard",
    LOGIN: "/login",
    REGISTER: "/register",
    REGISTER_CUSTOMER: "/register-customer",
    CUSTOMER_LIST: "/customers",
  };

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.REGISTER_CUSTOMER} element={<CustomerPage />} />
      <Route path={ROUTES.CUSTOMER_LIST} element={<CustomerListPage />} />
      <Route
        path="*"
        element={<Navigate to={ROUTES.REGISTER_CUSTOMER} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
